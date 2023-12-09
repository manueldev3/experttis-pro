import assistance from '@/assets/img/assitance.jpg'

function Asistance() {
    return (
        <section className="asistance" id='asistance'>
            <h2 className="title">
                CONSULTANTS SELECTION
            </h2>

            <div className="wrapper">
                <div className="col-one">
                    <img src={assistance.src} alt="assistance" />
                </div>
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

export default Asistance;