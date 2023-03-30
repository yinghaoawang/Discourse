import './home.styles.scss';

const Home = () => {
    return (
        <div className='home-container'>
            <div className='inner-container'>
                <div className='content'>
                    <h1 className='header'>What's New in Discourse</h1>
                    <li>3/29/23 - <span>Video chat and voice chat panel added</span></li>
                    <li>3/28/23 - <span>Voice chat for mobile working</span></li>
                    <li>3/26/23 - <span>Status messages added</span></li>
                    <li>3/25/23 - <span>User authentication added</span></li>
                    <li>3/24/23 - <span>Added sounds for voice channel joining/leaving and text messages</span></li>
                    <li>3/23/23 - <span>Change audio input and output device working</span></li>
                    <li>3/21/23 - <span>Voice call functionality for voice rooms added</span></li>
                    <li>3/11/23 - <span>Create channel modal form for text and voice channels added</span></li>
                    <li>3/10/23 - <span>Server shows Online/Offline users</span></li>
                    <li>3/9/23 - <span>Dynamic server & channel creation added</span></li>
                    <li>3/8/23 - <span>Redis used as primary database for speedy persistent data storage</span></li>
                    <li>3/7/23 - <span>Real time websocket transmission properly working</span></li>
                    <li>3/3/23 - <span>Real time chat working with long polling. User names added</span></li>
                    <li>3/2/23 - <span>All modules refactored completely</span></li>
                    <li>12/16/22 - <span>All proof of concept frontend components finished</span></li>
                    <li>12/4/22 - <span>Project started as a proof of concept</span></li>
                </div>
            </div>
            
        </div>
    );
}

export default Home;