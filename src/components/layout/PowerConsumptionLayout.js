import Layout from './Layout';

export default function PowerConsumptionLayout({ InsideContent }) {
    return (
        <>
            <Layout activePage={'Power Consumption'}>

                {/* Inside Content */}
                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <InsideContent />
                </div>

            </Layout>
        </>
    );
};
