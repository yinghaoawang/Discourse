import './home.styles.scss';

const Home = () => {
    return (
        <div className='home-container'>
            <div className='content'>
                <h1 className='header'>What's New in Discourse</h1>
                <li>All modules refactored completely</li>
                <li>Data loading for servers</li>
            </div>
        </div>
    );
}

export default Home;