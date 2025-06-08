import React, { Component } from 'react'; // Added explicit React import
import { Typography, Divider, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Countdown from 'react-countdown';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import * as THREE from 'three';
import MyChatBot from './chatbot/chatApp';
import './Home.css'; // CSS for animations

interface AppState {
  issPosition: { latitude: number; longitude: number; altitude: number } | null;
  loading: boolean;
  globeError: boolean;
  globeInitialized: boolean;
}

type HomeProps = {
  serverUrl: string;
};

class Home extends Component<HomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;
  private readonly launchDate = new Date('2025-06-10T17:52:00+05:30');
  private readonly issApiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';
  private intervalId: NodeJS.Timeout | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: any = null;
  private issMesh: THREE.Mesh | null = null;
  private animationFrameId: number | null = null;
  private globeRef = React.createRef<HTMLDivElement>(); // Now valid with React import

  constructor(props: HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
    this.state = { issPosition: null, loading: true, globeError: false, globeInitialized: false };
  }

  componentDidMount() {
    this.fetchIssPosition();
    this.intervalId = setInterval(this.fetchIssPosition, 10000); // 10s interval
    this.initThreeJs();
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose(); // Dispose renderer resources
    }
    window.removeEventListener('resize', this.handleResize);
  }

  private fetchIssPosition = async () => {
    try {
      const response = await fetch(this.issApiUrl);
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      this.setState(
        {
          issPosition: {
            latitude: data.latitude,
            longitude: data.longitude,
            altitude: data.altitude,
          },
          loading: false,
        },
        () => this.updateIssPosition()
      );
    } catch (error) {
      console.error('Error fetching ISS position:', error);
      this.setState({ loading: false });
    }
  };

  private initThreeJs = () => {
    if (!this.globeRef.current) {
      console.error('Globe container ref not found');
      this.setState({ globeError: true, globeInitialized: false });
      return;
    }

    // Only initialize if not already done
    if (this.state.globeInitialized) return;

    import('three/examples/jsm/controls/OrbitControls').then(({ OrbitControls }) => {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      this.camera.position.set(0, 0, 3);
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.globeRef.current.appendChild(this.renderer.domElement);
      this.handleResize();

      // Add Earth with retry logic
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const textureLoader = new THREE.TextureLoader();
      let textureLoadAttempts = 0;
      const maxAttempts = 3;

      const loadTexture = () => {
        textureLoader.load(
          'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
          (texture) => {
            const material = new THREE.MeshStandardMaterial({ map: texture });
            const earth = new THREE.Mesh(geometry, material);
            this.scene?.add(earth);
            console.log('Earth texture loaded successfully');
            this.setState({ globeInitialized: true, globeError: false });
          },
          undefined,
          (err) => {
            console.error('Texture load error:', err);
            textureLoadAttempts++;
            if (textureLoadAttempts < maxAttempts) {
              console.log(`Retrying texture load (attempt ${textureLoadAttempts + 1}/${maxAttempts})`);
              setTimeout(loadTexture, 1000); // Retry after 1s
            } else {
              this.setState({ globeError: true, globeInitialized: false });
            }
          }
        );
      };

      loadTexture();

      // Add ISS marker
      const issGeometry = new THREE.SphereGeometry(0.02, 16, 16);
      const issMaterial = new THREE.MeshStandardMaterial({ color: 'red', emissive: 'red', emissiveIntensity: 0.5 });
      this.issMesh = new THREE.Mesh(issGeometry, issMaterial);
      this.scene?.add(this.issMesh);

      // Lighting
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
      pointLight.position.set(10, 10, 10);
      this.scene.add(pointLight);

      // OrbitControls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;
      this.controls.enableZoom = true;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 5;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;

      // Animation loop
      const animate = () => {
        this.animationFrameId = requestAnimationFrame(animate);
        if (this.scene && this.camera && this.renderer && this.issMesh) {
          this.controls.update();
          this.issMesh.scale.set(0.5 + 0.2 * Math.sin(Date.now() * 0.002), 0.5 + 0.2 * Math.sin(Date.now() * 0.002), 0.5 + 0.2 * Math.sin(Date.now() * 0.002));
          this.renderer.render(this.scene, this.camera);
        }
      };
      animate();

      window.addEventListener('resize', this.handleResize);
    });
  };

  private handleResize = () => {
    if (this.renderer && this.camera && this.globeRef.current) {
      const width = this.globeRef.current.clientWidth;
      const height = window.innerWidth < 600 ? 250 : 400;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  };

  private getIss3DPosition = (latitude: number, longitude: number, altitude: number) => {
    const radius = 1 + altitude / 6371; // Earth radius = 6371 km
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return [x, y, z] as [number, number, number];
  };

  private updateIssPosition = () => {
    if (this.issMesh && this.state.issPosition && this.state.globeInitialized) {
      const { latitude, longitude, altitude } = this.state.issPosition;
      this.issMesh.position.set(...this.getIss3DPosition(latitude, longitude, altitude));
    }
  };

  private countdownRenderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      return (
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <RocketLaunchIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h6" color="primary">
            Axiom Mission 4 has launched!
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          textAlign: 'center',
          my: 2,
          py: 3,
          background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)',
          borderRadius: 2,
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
          Countdown to Axiom Mission 4 Launch (IST)
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4" sx={{ mx: 2 }}>{days} Days</Typography>
          <Typography variant="h4" sx={{ mx: 2 }}>{hours} Hours</Typography>
          <Typography variant="h4" sx={{ mx: 2 }}>{minutes} Minutes</Typography>
          <Typography variant="h4" sx={{ mx: 2 }}>{seconds} Seconds</Typography>
        </Box>
      </Box>
    );
  };

  render() {
    return (
      <>
        <div className="content-wrapper">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6} lg={5}>
              <div className="section">
                <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
                  Welcome to Axiom Mission 4 Tracker
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ minHeight: 500 }}>
                  {!this.state.globeInitialized && !this.state.globeError && (
                    <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
                  )}
                  {this.state.globeError && <Typography color="error">There was an error loading the globe.</Typography>}
                  <div ref={this.globeRef} style={{ height: '100%' }} />
                </Box>
                <Countdown
                  date={this.launchDate}
                  renderer={this.countdownRenderer}
                />
              </div>
            </Grid>
          </Grid>
          <MyChatBot />
        </div>
      </>
    );
  }
}

export default Home;
