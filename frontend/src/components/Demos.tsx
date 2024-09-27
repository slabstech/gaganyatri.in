import FoodGuardian from './demos/FoodGuardian';
import Recipes from './demos/Recipes';

const Demos = () => {
	return (
		<div className="container">
			<div className="row">
        <div className="col-md-6">
          <FoodGuardian />
        </div>
        <hr />
        <hr />
        <div className="col-md-6">
          <Recipes />
        </div>
      </div>
		</div>
	);
};

export default Demos;