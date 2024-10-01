import { useNavigate } from 'react-router-dom';

const About = () => {
	const navigate = useNavigate();
	return (
		<div className="container">
			<button className="btn" onClick={() => navigate(-1)}>
				Go Back
			</button>
			<div className="title">
				<h1>About</h1>
			</div>
			<div className="about-container">
				<p>
					Building Tech for Mars
				</p>
				<p>
					Creating Intelligent software to incorporate on Robots
				</p>
			</div>
		</div>
	);
};

export default About;