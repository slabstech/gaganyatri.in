import { Component } from 'react';
import { Typography, Divider, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Countdown from 'react-countdown';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import * as THREE from 'three';
import MyChatBot from './chatbot/chatApp';
import './Home.css'; // Add CSS file for animations

interface AppState {
  issPosition: { latitude: number; longitude: number; altitude: number } | null;
  loading: boolean;
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
  private controls: any = null; // OrbitControls is loaded dynamically
  private issMesh: THREE.Mesh | null = null;

  constructor(props: HomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
    this.state = { issPosition: null, loading: true };
  }

  componentDidMount() {
    this.fetchIssPosition();
    this.intervalId = setInterval(this.fetchIssPosition, 5000);
    this.initThreeJs();
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.renderer) {
      const canvas = this.renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      this.renderer.dispose();
    }
  }

  private fetchIssPosition = async () => {
    try {
      const response = await fetch(this.issApiUrl);
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

  private initThreeJs = async () => {
    // Import OrbitControls dynamically to avoid ESM issues
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls');

    // Initialize scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    this.camera.position.set(0, 0, 3);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(400, 400); // Default size, adjusted later
    const canvasContainer = document.getElementById('globe-canvas');
    if (canvasContainer) canvasContainer.appendChild(this.renderer.domElement);

    // Add Earth
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const texture = new THREE.TextureLoader().load(
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
    );
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const earth = new THREE.Mesh(geometry, material);
    this.scene.add(earth);

    // Add ISS marker
    const issGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const issMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
    this.issMesh = new THREE.Mesh(issGeometry, issMaterial);
    this.scene.add(this.issMesh);

    // Lighting
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    this.scene.add(pointLight);

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls?.update();
      this.renderer?.render(this.scene!, this.camera!);
      // Pulse ISS marker
      if (this.issMesh) {
        const scale = 0.5 + 0.2 * Math.sin(Date.now() * 0.002);
        this.issMesh.scale.set(scale, scale, scale);
      }
    };
    animate();

    // Handle resize
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  };

  private handleResize = () => {
    if (this.renderer && this.camera) {
      const container = document.getElementById('globe-canvas');
      if (container) {
        const width = container.clientWidth;
        const height = window.innerWidth < 600 ? 300 : 400;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
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
    if (this.issMesh && this.state.issPosition) {
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
          py: 4,
          background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)',
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Countdown to Axiom Mission 4 Launch (IST)
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          {[
            { value: days, label: 'Days' },
            { value: hours, label: 'Hours' },
            { value: minutes, label: 'Minutes' },
            { value: seconds, label: 'Seconds' },
          ].map(({ value, label }) => (
            <Box
              key={label}
              className="flip-card"
              sx={{
                minWidth: 80,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: 4,
                padding: 1,
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {value.toString().padStart(2, '0')}
              </Typography>
              <Typography variant="caption">{label}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 2 }}>
          <RocketLaunchIcon sx={{ fontSize: 30, color: 'white' }} />
        </Box>
      </Box>
    );
  };

  render() {
    const { issPosition, loading } = this.state;

    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={2} columns={12}>
          <div style={{ display: 'none' }}>
            <Grid size={{ xs: 12 }}></Grid>
            <Grid size={{ xs: 12 }}>
              <Divider />
            </Grid>
          </div>
          <Grid size={{ xs: 12 }}>
            <Countdown
              date={this.launchDate}
              renderer={this.countdownRenderer}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                my: 2,
                py: 4,
                background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)',
                borderRadius: 2,
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" gutterBottom>
                Real-Time ISS Tracking
              </Typography>
              <Box
                id="globe-canvas"
                sx={{ height: { xs: 300, md: 400 }, position: 'relative' }}
              >
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress color="inherit" />
                  </Box>
                )}
              </Box>
              {issPosition && !loading && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  ISS Position: Lat {issPosition.latitude.toFixed(2)}°, Lon {issPosition.longitude.toFixed(2)}°, Alt {issPosition.altitude.toFixed(2)} km
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <MyChatBot serverUrl={this.serverBaseUrl} isOnline={this.isOnline} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default Home;