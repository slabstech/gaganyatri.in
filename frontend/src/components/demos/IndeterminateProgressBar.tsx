import React from 'react';

interface IndeterminateProgressBarProps {
    loading: boolean; // Boolean to control the visibility of the progress bar
}

const IndeterminateProgressBar: React.FC<IndeterminateProgressBarProps> = ({ loading }) => {
    return (
            <div className='progressBar' data-loading={loading ? 'true' : 'false'} >
                <span>AI Thinking...  </span>
                <progress />
            </div>
    );
};

export default IndeterminateProgressBar;