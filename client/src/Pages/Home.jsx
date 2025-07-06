import React from 'react';
import { Helmet } from 'react-helmet';
import Banner from '../Components/Banner.jsx';
import TopItems from '../Components/TopItems.jsx';
import ExtraOne from '../Components/ExtraOne.jsx';
import ExtraTwo from '../Components/ExtraTwo.jsx';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>FindMyStuff</title>
            </Helmet>
            <Banner />
            <TopItems />
            <ExtraOne />
            <ExtraTwo />
        </div>
    );
};

export default Home;