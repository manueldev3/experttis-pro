import '@/styles/globals.scss';

function page() {
    return (
        <section className="contact">

            <div className="bg-image">
                <h2>¿DO YOU NEED HELP?</h2>
                <p>CONTACT US</p>
            </div>

            <div className="wrapper">
                <div className="col-two">
                    <div>
                        <h3>FIND A CONSULTANT</h3>
                        <p>To search outside EXPERTTIS data base.</p>
                        <div className="flex">
                            <p>Contact: </p>
                            <a href="mailto:search@experttis.com">search@experttis.com</a>
                        </div>
                    </div>
                    <div>
                        <h3>LONG TERM CONSULTANCY</h3>
                        <p>Contract experts for long term work.</p>
                        <div className="flex">
                            <p>Contact: </p>
                            <a href="mailto:longterm@experttis.com">longterm@experttis.com</a>
                        </div>
                    </div>
                    <div>
                        <h3>TECHNICAL PROBLEMS</h3>
                        <div className="flex">
                            <p>Contact: </p>
                            <a href="mailto:support@experttis.com">support@experttis.com</a>
                        </div>
                    </div>
                    <div>
                        <h3>ANY OTHER ISSUE</h3>
                        <div className="flex">
                            <p>Contact: </p>
                            <a href="mailto:services@experttis.com">services@experttis.com</a>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}

export default page;