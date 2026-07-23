import Layout from './Layout';

export default function AnalyticsLayout({ InsideContent }) {
    return (
        <>
            <Layout activePage={'Analytics'}>

                {/* Inside Content */}
                <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <InsideContent />
                </div>

            </Layout>
        </>
    );
};
