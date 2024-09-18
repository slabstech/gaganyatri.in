# Gaganyatri Project

- Tech Stack
  - Frontend
    - React + Vite + Typescript
    - Hostend on GitHub Pages
  - Backend
    - Django + Python
    - Hosted on HuggingFace
  - AI inference
    - La Platforme - Mistral

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/gaganyatri.git`
2. Navigate to the project directory: `cd gaganyatri`
3. Open the `index.html` file in your preferred web browser.

## Usage

The website is designed to be user-friendly and easy to navigate. You can explore the different sections to learn more about the mission, the space suit, and the astronauts.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Reference

ISS tracker - https://github.com/the-coding-pie/ISSTracker


- Code
  - npm create vite@latest gaganyatri -- --template react-swc-ts
  - npm install
  - npm run dev
  - npm run build
  - npm run deploy

- gaganyatri.in
- Backend
  - https://gaganyatri-django-spaces.hf.space/swagger/


# set Mistral API Key (using bash for example)
$ echo 'export MISTRAL_API_KEY=[your_key_here]' >> ~/.bashrc

# reload the environment (or just quit and open a new terminal)
$ source ~/.bashrc