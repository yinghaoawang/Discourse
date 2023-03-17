import './home.styles.scss';

const Home = () => {
    return (
        <div className='home-container'>
            <div className='inner-container'>
                <div className='content'>
                    <h1 className='header'>What's New in Discourse</h1>
                    <li>3/11/23 - <span>Create channel modal form added</span></li>
                    <li>3/10/23 - <span>Server shows Online/Offline users</span></li>
                    <li>3/9/23 - <span>Dynamic server & channel creation added</span></li>
                    <li>3/8/23 - <span>Redis used as primary database for lightning speed persistent data storage</span></li>
                    <li>3/7/23 - <span>Real time websocket transmission properly working</span></li>
                    <li>3/3/23 - <span>Real time chat working with long polling. User names added</span></li>
                    <li>3/2/23 - <span>All modules refactored completely</span></li>
                    <li>12/16/22 - <span>All frontend components added</span></li>
                    <li>12/4/22 - <span>Project started as a proof of concept</span></li>
                </div>
            </div>
            
        </div>
    );
}

export default Home;