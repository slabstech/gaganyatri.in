import React, { Component } from 'react';
import { Typography, Divider, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Countdown from 'react-countdown';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import * as THREE from 'three';
import './Tracker.css';

interface AppState {}

type TrackerHomeProps = {
  serverUrl: string;
};


interface IssPosition {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
}

interface AppState {
  issPosition: IssPosition | null;
  issPath: IssPosition[];
  loading: boolean;
  globeError: boolean;
  globeInitialized: boolean;
}


class TrackerHome extends Component<TrackerHomeProps, AppState> {
  serverBaseUrl = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  isOnline = true;

  private readonly launchDate = new Date('2025-06-10T17:52:00+05:30');
  private readonly issApiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';
  private readonly maxPathPoints = 100; // Limit total path points
  private readonly tubeRadius = 0.005; // Thickness of orbital path tubes
  private readonly cameraDistance = 2.5; // Distance from ISS for camera
  private readonly orbitDuration = 90 * 60 * 1000; // 90 minutes in milliseconds
  private intervalId: NodeJS.Timeout | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private controls: any = null;
  private issMesh: THREE.Mesh | null = null;
  private issPathMesh: THREE.Mesh | null = null; // Blue tube for older orbits
  private issLastOrbitMesh: THREE.Mesh | null = null; // Green tube for last completed orbit
  private issCurrentOrbitMesh: THREE.Mesh | null = null; // Yellow tube for current orbit
  private animationFrameId: number | null = null;
  private globeRef = React.createRef<HTMLDivElement>();



  constructor(props: TrackerHomeProps) {
    super(props);
    this.serverBaseUrl = this.props.serverUrl;
        this.state = {
      issPosition: null,
      issPath: [],
      loading: true,
      globeError: false,
      globeInitialized: false,
    };

  }


    componentDidMount() {
      this.fetchIssPosition();
      this.intervalId = setInterval(this.fetchIssPosition, 10000);
      this.initThreeJs();
    }
  
    componentWillUnmount() {
      if (this.intervalId) clearInterval(this.intervalId);
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      if (this.renderer) {
        this.renderer.dispose();
      }
      window.removeEventListener('resize', this.handleResize);
    }
  
    private fetchIssPosition = async () => {
      try {
        const response = await fetch(this.issApiUrl);
        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        const newPosition: IssPosition = {
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude,
          timestamp: Date.now(),
        };
        this.setState(
          (prevState) => ({
            issPosition: newPosition,
            issPath: [...prevState.issPath, newPosition].slice(-this.maxPathPoints),
            loading: false,
          }),
          () => {
            this.updateIssPosition();
            this.updateIssPath();
          }
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
  
      if (this.state.globeInitialized) return;
  
      import('three/examples/jsm/controls/OrbitControls').then(({ OrbitControls }) => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        this.camera.position.set(0, 0, 3);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.globeRef.current!.appendChild(this.renderer.domElement);
        this.handleResize();
  
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
                setTimeout(loadTexture, 1000);
              } else {
                this.setState({ globeError: true, globeInitialized: false });
              }
            }
          );
        };
  
        loadTexture();
  
        const issGeometry = new THREE.SphereGeometry(0.02, 16, 16);
        const issMaterial = new THREE.MeshStandardMaterial({ color: 'red', emissive: 'red', emissiveIntensity: 0.5 });
        this.issMesh = new THREE.Mesh(issGeometry, issMaterial);
        this.scene?.add(this.issMesh);
  
        // Initialize blue tube for older orbits
        const pathMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue
        const pathGeometry = new THREE.BufferGeometry();
        this.issPathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
        this.scene?.add(this.issPathMesh);
  
        // Initialize green tube for last completed orbit
        const lastOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green
        const lastOrbitGeometry = new THREE.BufferGeometry();
        this.issLastOrbitMesh = new THREE.Mesh(lastOrbitGeometry, lastOrbitMaterial);
        this.scene?.add(this.issLastOrbitMesh);
  
        // Initialize yellow tube for current orbit
        const currentOrbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow
        const currentOrbitGeometry = new THREE.BufferGeometry();
        this.issCurrentOrbitMesh = new THREE.Mesh(currentOrbitGeometry, currentOrbitMaterial);
        this.scene?.add(this.issCurrentOrbitMesh);
  
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const pointLight = new THREE.PointLight(0xffffff, 1.2, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
  
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enablePan = false;
        this.controls.enableZoom = true;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 5;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
  
        const animate = () => {
          this.animationFrameId = requestAnimationFrame(animate);
          if (this.scene && this.camera && this.renderer && this.issMesh) {
            this.controls.update();
            this.issMesh.scale.set(
              0.5 + 0.2 * Math.sin(Date.now() * 0.002),
              0.5 + 0.2 * Math.sin(Date.now() * 0.002),
              0.5 + 0.2 * Math.sin(Date.now() * 0.002)
            );
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
      const radius = 1 + altitude / 6371;
      const phi = (90 - latitude) * (Math.PI / 180);
      const theta = (longitude + 180) * (Math.PI / 180);
      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };
  
    private updateIssPosition = () => {
      if (this.issMesh && this.camera && this.controls && this.state.issPosition && this.state.globeInitialized) {
        const { latitude, longitude, altitude } = this.state.issPosition;
        const issPosition = this.getIss3DPosition(latitude, longitude, altitude);
        
        // Update ISS mesh position
        this.issMesh.position.copy(issPosition);
  
        // Position the camera to focus on the ISS
        const cameraOffset = issPosition.clone().normalize().multiplyScalar(this.cameraDistance);
        this.camera.position.copy(issPosition.clone().add(cameraOffset));
        this.camera.lookAt(issPosition);
        this.controls.target.copy(issPosition);
        this.controls.update();
      }
    };
  
    private updateIssPath = () => {
      if (!this.issPathMesh || !this.issLastOrbitMesh || !this.issCurrentOrbitMesh || !this.state.globeInitialized) return;
  
      const now = Date.now();
      const orbitDuration = this.orbitDuration;
  
      // Filter points for current orbit (last 90 minutes)
      const currentOrbitPoints = this.state.issPath.filter(
        (point) => now - point.timestamp <= orbitDuration
      );
  
      // Filter points for last completed orbit (90 to 180 minutes ago)
      const lastOrbitPoints = this.state.issPath.filter(
        (point) => now - point.timestamp > orbitDuration && now - point.timestamp <= 2 * orbitDuration
      );
  
      // Filter points for older orbits (older than 180 minutes)
      const olderPoints = this.state.issPath.filter(
        (point) => now - point.timestamp > 2 * orbitDuration
      );
  
      // Update current orbit (yellow)
      if (currentOrbitPoints.length > 1) {
        const points = currentOrbitPoints.map(({ latitude, longitude, altitude }) =>
          this.getIss3DPosition(latitude, longitude, altitude)
        );
        const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, this.tubeRadius, 8, false);
        this.issCurrentOrbitMesh.geometry.dispose();
        this.issCurrentOrbitMesh.geometry = tubeGeometry;
      } else {
        this.issCurrentOrbitMesh.geometry.dispose();
        this.issCurrentOrbitMesh.geometry = new THREE.BufferGeometry();
      }
  
      // Update last completed orbit (green)
      if (lastOrbitPoints.length > 1) {
        const points = lastOrbitPoints.map(({ latitude, longitude, altitude }) =>
          this.getIss3DPosition(latitude, longitude, altitude)
        );
        const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, this.tubeRadius, 8, false);
        this.issLastOrbitMesh.geometry.dispose();
        this.issLastOrbitMesh.geometry = tubeGeometry;
      } else {
        this.issLastOrbitMesh.geometry.dispose();
        this.issLastOrbitMesh.geometry = new THREE.BufferGeometry();
      }
  
      // Update older orbits (blue)
      if (olderPoints.length > 1) {
        const points = olderPoints.map(({ latitude, longitude, altitude }) =>
          this.getIss3DPosition(latitude, longitude, altitude)
        );
        const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, this.tubeRadius, 8, false);
        this.issPathMesh.geometry.dispose();
        this.issPathMesh.geometry = tubeGeometry;
      } else {
        this.issPathMesh.geometry.dispose();
        this.issPathMesh.geometry = new THREE.BufferGeometry();
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
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid>
            <div className="section">
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ minHeight: 500 }}>
                {!this.state.globeInitialized && !this.state.globeError && (
                  <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />
                )}
                {this.state.globeError && <Typography color="error">There was an error loading the globe.</Typography>}
                <div ref={this.globeRef} style={{ height: '100%' }} />
              </Box>
            </div>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default TrackerHome;