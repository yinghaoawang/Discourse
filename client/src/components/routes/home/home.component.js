import './home.styles.scss';

const Home = () => {
    return (
        <div className='home-container'>
            <div className='inner-container'>
                <div className='content'>
                    <h1 className='header'>What's New in Discourse</h1>
                    <li>User names added</li>
                    <li>Real time chat working</li>
                    <li>All modules refactored completely</li>
                </div>
            </div>
            
        </div>
    );
}

export default Home;