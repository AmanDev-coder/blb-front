import { Routes, Route } from "react-router-dom";
import styles from "./SettingsHolder.module.scss";
import GeneralSettings from "./components/Settings/GeneralSettings";
import OwnerManagement from "./components/Settings/OwnerManagement";
import BookingSettings from "./components/Settings/BookingSettings";
import ReportsAnalytics from "./components/Settings/ReportsAnalytics";
import NotificationsSettings from "./components/Settings/Notifications";
import APIIntegration from "./components/Settings/APIIntegration";
import DataPrivacy from "./components/Settings/DataPrivacySettings";
import ChatSupport from "./components/Settings/ChatSupport";

const SettingsHolder = () => {
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsContent}>
        <Routes>
          <Route path="general" element={<GeneralSettings />} />
          <Route path="owner-management" element={<OwnerManagement />} />
          <Route path="booking" element={<BookingSettings />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="notifications" element={<NotificationsSettings />} />
          <Route path="api" element={<APIIntegration />} />
          
          <Route path="privacy" element={<DataPrivacy />} />
          <Route path="chat-support" element={<ChatSupport />} />
        </Routes>
      </div>
    </div>
  );
};

export default SettingsHolder;
