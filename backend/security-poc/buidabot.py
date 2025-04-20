import os
import subprocess
import shutil
import requests
import re
from collections import defaultdict

class BuildABot:
    def __init__(self, args):
        self.args = args
        self.company_name = args[0]
        self.project_name = args[1]
        self.artifactory_url = args[2]
        self.artifactory_port = args[3]
        self.arti_install = args[4]
        self.is_test = args[5]
        self.data_dir = 'data'
        self.scripts_dir = 'scripts'

    def pre_setup(self):
        print("Started Running Presetup")
        os.chmod(f'{self.scripts_dir}/cleanup_files', 0o755)
        subprocess.run([f'{self.scripts_dir}/cleanup_files'], check=True)
        print("Completed Presetup")

    def populate_metadata(self):
        print("Started Running populate_metadata()")
        jar_files = [os.path.relpath(path, start='.') for path in os.scandir('.') if path.is_file() and path.name.endswith('.jar')]
        with open(f'{self.data_dir}/filelist.txt', 'w') as f:
            f.write('\n'.join(sorted(set(jar_files))))

        metadata = []
        for file_name in jar_files:
            json_data = self.jar_json_maven_repo(file_name)
            is_modified = self.jar_modification(json_data)
            is_upgradable = 0  # Placeholder for actual implementation
            fname = os.path.basename(file_name)
            jar_vendor = fname.replace('.jar', '')
            version_id, latest_version_id = '1.0', '1.0'

            if is_modified == 0:
                artifact_id = f'lib-{jar_vendor}'
                group_id = f'{self.company_name}.{self.project_name}.{jar_vendor}'
            else:
                try:
                    group_id = self.get_group_id(json_data)
                    artifact_id = self.get_artifact_id(json_data)
                    version_id = self.get_version_id(json_data)
                    latest_version_id = self.get_latest_version_id(group_id, artifact_id)
                except Exception as e:
                    print(f"Error processing {file_name}: {e}")
                    with open(f'{self.data_dir}/failing_jars.txt', 'a') as f:
                        f.write(f"{json_data}\n{jar_vendor}\n")
                    artifact_id = f'lib-{jar_vendor}'
                    group_id = f'{self.company_name}.{self.project_name}.{jar_vendor}'
                    version_id = latest_version_id = '1.0'
                    is_modified = 0

            metadata.append((file_name, fname, version_id, latest_version_id, is_modified, is_upgradable, group_id, artifact_id))

        with open(f'{self.data_dir}/library_metadata.txt', 'w') as f:
            f.write('\n'.join([f"{row[0]} \t {row[1]} \t {row[2]} \t {row[3]} \t {row[4]} \t {row[5]} \t {row[6]} \t {row[7]}" for row in metadata]))

        print("Completed populate_metadata()")

    def process_ignore_list(self):
        ignore_list = []
        with open(f'{self.data_dir}/ignore_jars.txt', 'r') as f:
            for line in f:
                file_type, file_info = line.split()
                ignore_list.append((file_type, file_info))

        with open(f'{self.data_dir}/library_metadata.txt', 'r') as f:
            lines = f.readlines()

        with open(f'{self.data_dir}/library_metadata.txt', 'w') as f:
            for line in lines:
                if not any(file_info in line for _, file_info in ignore_list):
                    f.write(line)

    def remove_duplicates_in_metadata(self):
        modified_jars = defaultdict(list)
        central_maven_jars = defaultdict(list)

        with open(f'{self.data_dir}/library_metadata.txt', 'r') as f:
            for line in f:
                parts = line.split()
                is_modified = int(parts[4])
                artifact_id = parts[7]
                if is_modified == 0:
                    modified_jars[artifact_id].append(line)
                else:
                    central_maven_jars[artifact_id].append(line)

        with open(f'{self.data_dir}/process_modified.txt', 'w') as f:
            for artifact_id, lines in modified_jars.items():
                f.write(lines[0])

        with open(f'{self.data_dir}/process_central.txt', 'w') as f:
            for artifact_id, lines in central_maven_jars.items():
                f.write(lines[0])

    def generate_installer_file(self):
        print("Started Running generate_installer_file()")
        url = self.artifactory_url if self.artifactory_url else 'localhost'

        if os.path.exists(f'{self.data_dir}/process_modified.txt'):
            with open(f'{self.data_dir}/process_modified.txt', 'r') as f:
                for line in f:
                    parts = line.split()
                    file_name = parts[0]
                    current_version = parts[2]
                    group_id = parts[6]
                    artifact_id = parts[7]

                    if self.arti_install == 0:
                        with open(f'{self.scripts_dir}/local_install', 'a') as install_file:
                            install_file.write(f'echo installing {file_name} in local maven repo as {artifact_id}\n')
                            install_file.write(f'mvn -q install:install-file -Dfile={file_name} -DgroupId={group_id} -DartifactId={artifact_id} -Dversion={current_version} -Dpackaging=jar  2> /dev/null\n')
                            install_file.write('if [ "$?" -ne 0 ] ; then\n')
                            install_file.write('echo "could not perform installation"; exit $rc\n')
                            install_file.write('fi\n\n')
                    elif self.arti_install == 1:
                        with open(f'{self.scripts_dir}/deploy_install', 'a') as install_file:
                            install_file.write(f'echo installing {file_name} in artifactory repo as {artifact_id}\n')
                            install_file.write(f'mvn deploy:deploy-file -DrepositoryId=releases -Durl=http://{url}:{self.artifactory_port}/artifactory/libs-release -Dfile={file_name} -DgroupId={group_id} -DartifactId={artifact_id} -Dversion={current_version} -Dpackaging=jar  2> /dev/null\n')
                            install_file.write('if [ "$?" -ne 0 ] ; then\n')
                            install_file.write('echo "could not perform installation"; exit $rc\n')
                            install_file.write('fi\n\n')

        print("Completed generate_installer_file()")

    def generate_pom(self):
        print("Started Running generate_pom()")
        pom_content = []

        with open(f'{self.data_dir}/pom_stub.txt', 'r') as f:
            pom_content.append(f.read())

        pom_content = [content.replace('artifactory_url', self.artifactory_url)
                               .replace('artifactory_port', self.artifactory_port)
                               .replace('artifact_id_proj', self.project_name)
                               .replace('group_id_proj', self.company_name)
                       for content in pom_content]

        dependencies = []

        if os.path.exists(f'{self.data_dir}/process_modified.txt'):
            with open(f'{self.data_dir}/process_modified.txt', 'r') as f:
                for line in f:
                    parts = line.split()
                    current_version = parts[2]
                    group_id = parts[6]
                    artifact_id = parts[7]
                    dependencies.append(f'\t\t<dependency>\n\t\t\t<groupId>{group_id}</groupId>\n\t\t\t<artifactId>{artifact_id}</artifactId>\n\t\t\t<version>{current_version}</version>\n\t\t</dependency>')

        if os.path.exists(f'{self.data_dir}/process_central.txt'):
            with open(f'{self.data_dir}/process_central.txt', 'r') as f:
                for line in f:
                    parts = line.split()
                    upgrade_version = parts[3]
                    group_id = parts[6]
                    artifact_id = parts[7]
                    dependencies.append(f'\t\t<dependency>\n\t\t\t<groupId>{group_id}</groupId>\n\t\t\t<artifactId>{artifact_id}</artifactId>\n\t\t\t<version>{upgrade_version}</version>\n\t\t</dependency>')

        pom_content.append('\t</dependencies>\n</project>')

        with open(f'{self.data_dir}/pom.xml', 'w') as f:
            f.write(''.join(pom_content + dependencies))

        print("Completed generate_pom()")

    def install_dependencies(self):
        print("Installing all dependencies")
        if self.arti_install == 1:
            os.chmod(f'{self.scripts_dir}/deploy_install', 0o755)
            subprocess.run([f'{self.scripts_dir}/deploy_install'], check=True)
        else:
            os.chmod(f'{self.scripts_dir}/local_install', 0o755)
            subprocess.run([f'{self.scripts_dir}/local_install'], check=True)
        print("Completed installing dependencies")

    def run_gen_pom(self):
        print("Running maven install for the project")
        shutil.copy(f'{self.data_dir}/temp_pom.xml', f'{self.data_dir}/pom.xml')
        if self.is_test == 1:
            shutil.move(f'{self.data_dir}/temp_pom.xml', 'example/pom.xml')
            subprocess.run(['mvn', 'clean', 'install', '-f', 'example/pom.xml', '-q'], stderr=subprocess.DEVNULL)
            if subprocess.call(['mvn', 'clean', 'install', '-f', 'example/pom.xml', '-q'], stderr=subprocess.DEVNULL) == 0:
                print('Maven project compiled successfully')
                exit(0)
        else:
            shutil.move(f'{self.data_dir}/temp_pom.xml', f'{self.data_dir}/pom.xml')

    def jar_json_maven_repo(self, file_name):
        sha1sum = subprocess.check_output(['sha1sum', file_name]).decode().split()[0]
        response = requests.get(f'http://search.maven.org/solrsearch/select?q=1:%22{sha1sum}%22&rows=20&wt=json')
        return response.json().get('response', {})

    def jar_modification(self, json_data):
        return json_data.get('numFound', 0)

    def get_group_id(self, json_data):
        return json_data.get('docs', [])[0].get('g', '')

    def get_artifact_id(self, json_data):
        return json_data.get('docs', [])[0].get('a', '')

    def get_version_id(self, json_data):
        return json_data.get('docs', [])[0].get('v', '')

    def get_latest_version_id(self, group_id, artifact_id):
        response = requests.get(f'https://search.maven.org/solrsearch/select?q=g:{group_id}+AND+a:{artifact_id}&core=gav&rows=20&wt=json')
        return response.json().get('response', {}).get('docs', [])[0].get('latestVersion', '')

    def generate_lib_removal(self):
        print("Started generate_lib_removal()")
        if os.path.exists(f'{self.data_dir}/library_metadata.txt'):
            with open(f'{self.data_dir}/library_metadata.txt', 'r') as f:
                lines = f.readlines()
            with open(f'{self.scripts_dir}/library_removal', 'w') as f:
                f.write("is_git=$1\n")
                for line in lines:
                    parts = line.split()
                    file_name = parts[0]
                    is_modified = int(parts[4])
                    if is_modified == 1:
                        f.write(f'git rm {file_name}\n')
        print("Completed generate_lib_removal()")

    def print_parameters(self):
        print("\nRunning ant2Maven Script with below parameters \n")
        print(f'CompanyName = {self.company_name}, ProjectName = {self.project_name}, Artifactory_URL = {self.artifactory_url}, Artifactory_Port = {self.artifactory_port}, IsArtifactoryInstall = {self.arti_install}, IsTestRun = {self.is_test} \n')

    def usage(self):
        if len(self.args) != 6:
            print("Illegal number of parameters\n")
            print("Usage :\n")
            print("python buildabot.py <function_name> <company_name> <project_name> <artifact_repo_url> <artifactory_port> <isArtfifactoryUrl> <isTestRun>\n")
            print("Ex. python buildabot.py exec com proj localhost 8081 0 1")
            exit(1)

    def run_conversion(self):
        self.usage()
        self.print_parameters()
        self.pre_setup()
        self.populate_metadata()
        self.process_ignore_list()
        self.remove_duplicates_in_metadata()
        self.generate_lib_removal()
        self.generate_pom()
        self.generate_installer_file()
        shutil.move(f'{self.data_dir}/pom.xml', f'{self.data_dir}/temp_pom.xml')
        self.install_dependencies()
        self.run_gen_pom()
        print(f"Pom file generated at {self.data_dir}/pom.xml")

    def run_test(self):
        function_name = self.args[0]
        if function_name == "all":
            self.test_all()
        elif function_name == "process_ignore_list":
            self.process_ignore_list()
        elif function_name == "remove_duplicates_in_metadata":
            self.remove_duplicates_in_metadata()
        elif function_name == "generate_pom":
            self.generate_pom()
        elif function_name == "generate_installer_file":
            self.generate_installer_file()
        elif function_name == "install_dependencies":
            self.install_dependencies()
        elif function_name == "generate_lib_removal":
            self.generate_lib_removal()
        elif function_name == "test_mock":
            self.test_mock()
        elif function_name in ["--help", "-help", "-h"]:
            self.usage()
        else:
            print(f"{function_name} is not a recognized function name.\n\n")
            self.usage()

    def test_all(self):
        print("Dummy function")
        return 1

    def test_mock(self):
        print("Calling this Function")

    def main(self):
        if len(self.args) == 0:
            print("No command specified\n\n")
            self.usage()
            exit(1)

        command = self.args[0]
        if command == "exec":
            self.run_conversion()
        elif command == "test":
            self.run_test()
        elif command in ["--help", "-help", "-h"]:
            self.usage()
        else:
            print(f"{command} is not a recognized function name.\n\n")
            self.usage()

if __name__ == "__main__":
    import sys
    buildabot = BuildABot(sys.argv[1:])
    buildabot.main()