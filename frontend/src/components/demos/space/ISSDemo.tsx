import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box, Typography, Tooltip } from '@mui/material';

interface ISSDemoProps {
  serverUrl: string;
  isOnline: boolean;
}

interface ISSDemoState {
  selectedModule: string | null;
  tooltipPosition: { x: number; y: number };
}

interface ISSModuleInfo {
  name: string;
  description: string;
  launchDate: string;
}

class ISSDemo extends Component<ISSDemoProps, ISSDemoState> {
  private mountRef: HTMLDivElement | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: InstanceType<typeof OrbitControls>; // Use InstanceType to get the type
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private modules: THREE.Mesh[] = [];

  // Mock data for ISS modules
  private moduleInfo: { [key: string]: ISSModuleInfo } = {
    Zarya: {
      name: 'Zarya',
      description: 'Functional Cargo Block, provides power and propulsion.',
      launchDate: 'November 20, 1998',
    },
    Unity: {
      name: 'Unity',
      description: 'Connecting module for US segments.',
      launchDate: 'December 4, 1998',
    },
    Destiny: {
      name: 'Destiny',
      description: 'US Laboratory Module for scientific research.',
      launchDate: 'February 7, 2001',
    },
  };

  constructor(props: ISSDemoProps) {
    super(props);
    this.state = {
      selectedModule: null,
      tooltipPosition: { x: 0, y: 0 },
    };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.camera.position.z = 5;
  }

  componentDidMount() {
    this.setupRenderer();
    this.createISSModules();
    this.addLights();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('click', this.handleClick);
    this.animate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('click', this.handleClick);
    this.renderer.dispose();
  }

  setupRenderer = () => {
    if (this.mountRef) {
      this.renderer.setSize(this.mountRef.clientWidth, this.mountRef.clientHeight);
      this.mountRef.appendChild(this.renderer.domElement);
      this.camera.aspect = this.mountRef.clientWidth / this.mountRef.clientHeight;
      this.camera.updateProjectionMatrix();
      this.controls.update();
    }
  };

  createISSModules = () => {
    // Simplified ISS modules as colored cubes
    const modulesData = [
      { name: 'Zarya', position: [0, 0, 0] as [number, number, number], color: 0xff0000 },
      { name: 'Unity', position: [2, 0, 0] as [number, number, number], color: 0x00ff00 },
      { name: 'Destiny', position: [4, 0, 0] as [number, number, number], color: 0x0000ff },
    ];

    modulesData.forEach((module) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: module.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(module.position[0], module.position[1], module.position[2]); // Explicitly pass arguments
      mesh.name = module.name;
      this.scene.add(mesh);
      this.modules.push(mesh);
    });
  };

  addLights = () => {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  };

  handleResize = () => {
    if (this.mountRef) {
      this.camera.aspect = this.mountRef.clientWidth / this.mountRef.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.mountRef.clientWidth, this.mountRef.clientHeight);
    }
  };

  handleClick = (event: MouseEvent) => {
    if (this.mountRef) {
      const rect = this.mountRef.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.modules);

      if (intersects.length > 0) {
        const moduleName = intersects[0].object.name;
        this.setState({
          selectedModule: moduleName,
          tooltipPosition: { x: event.clientX, y: event.clientY },
        });
      } else {
        this.setState({ selectedModule: null });
      }
    }
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    const { selectedModule, tooltipPosition } = this.state;
    const moduleInfo = selectedModule ? this.moduleInfo[selectedModule] : null;

    return (
      <Box sx={{ position: 'relative', width: '100%', height: '600px' }}>
        <div
          ref={(ref) => (this.mountRef = ref)}
          style={{ width: '100%', height: '100%' }}
        />
        {moduleInfo && (
          <Tooltip
            open={!!selectedModule}
            title={
              <Box>
                <Typography variant="h6">{moduleInfo.name}</Typography>
                <Typography>{moduleInfo.description}</Typography>
                <Typography>Launch Date: {moduleInfo.launchDate}</Typography>
              </Box>
            }
            placement="top"
            PopperProps={{
              style: {
                position: 'absolute',
                top: tooltipPosition.y,
                left: tooltipPosition.x,
              },
            }}
          >
            <Box />
          </Tooltip>
        )}
      </Box>
    );
  }
}

export default ISSDemo;