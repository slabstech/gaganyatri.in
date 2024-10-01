import React from 'react';

interface IndeterminateProgressBarProps {
    loading: boolean; // Boolean to control the visibility of the progress bar
}

const IndeterminateProgressBar: React.FC<IndeterminateProgressBarProps> = ({ loading }) => {
    return (
            <div className='progressBar' data-loading={loading ? 'true' : 'false'} >
                <span> looking ..  </span>
                <progress />
            </div>
    );
};

export default IndeterminateProgressBar;