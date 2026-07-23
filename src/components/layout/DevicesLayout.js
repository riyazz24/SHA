import { FiSearch, FiLogOut } from 'react-icons/fi';
import { MdDeviceHub } from 'react-icons/md';
import InsideLayout from "./InsideLayout";

export default function DevicesLayout({ activePage, InsideContent }) {
    const deviceMenu = [
        { type: 'link', label: 'All Devices', path: '/devices/all_devices', icon: MdDeviceHub },
        { type: 'link', label: 'Scan Devices', path: '/devices/scan_devices', icon: FiSearch },
        { type: 'divider' },
        { type: 'logout', icon: FiLogOut }
    ];

    return (
        <>
            <InsideLayout menu={deviceMenu} activePage={'Devices'} insideActivePage={activePage}>
                <InsideContent />
            </InsideLayout >
        </>
    );
};