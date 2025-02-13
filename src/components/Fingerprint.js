import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  Tabs,
  Tab,
  AppBar,
  Card,
  CardContent,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  Fingerprint as FingerprintIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

// Styled Container for layout
const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  minHeight: "100vh",
  backgroundColor: "#f9fafc",
});

// Styled Tabs
const StyledTabs = styled(AppBar)({
  borderRadius: "8px",
  overflow: "hidden",
  marginBottom: "20px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
});

// Styled Card for content sections
const StyledCard = styled(Card)({
  width: "100%",
  maxWidth: "800px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  },
});

// Styled Typography for section headers
const SectionHeader = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "10px",
  textAlign: "center",
});

// Card Content Styling
const CardContentWrapper = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  textAlign: "center",
});

// Fingerprint Status Styling
const StatusBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  marginTop: "8px",
});

// Function Component
function Fingerprint() {
  const [templateCount, setTemplateCount] = useState(null);
  const [enrolledFingerprints, setEnrolledFingerprints] = useState([]);
  const [scannedFingerprints, setScannedFingerprints] = useState([]);
  const [currentTab, setCurrentTab] = useState("enroll");

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(
          "http://16.171.32.161:4000/api/fingerprint/count"
        );
        setTemplateCount(response.data.count);
      } catch (error) {
        console.error("Error fetching template count:", error);
        setTemplateCount("Error fetching data");
      }
    };

    const fetchEnrolledFingerprints = async () => {
      try {
        const response = await axios.get(
          "http://16.171.32.161:4000/api/fingerprint/enroll"
        );
        setEnrolledFingerprints(response.data);
      } catch (error) {
        console.error("Error fetching enrolled fingerprints:", error);
      }
    };

    const fetchScannedFingerprints = async () => {
      try {
        const response = await axios.get(
          "http://16.171.32.161:4000/api/fingerprint/scan"
        );
        setScannedFingerprints(response.data);
      } catch (error) {
        console.error("Error fetching scanned fingerprints:", error);
      }
    };

    fetchCount();
    fetchEnrolledFingerprints();
    fetchScannedFingerprints();
  }, []);

  // Function to format timestamp into readable date and time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      weekday: "long", // e.g., "Monday"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "December"
      day: "numeric", // e.g., "23"
      hour: "2-digit", // e.g., "08"
      minute: "2-digit", // e.g., "32"
      second: "2-digit", // e.g., "57"
      hour12: true, // AM/PM format
    });
  };

  return (
    <StyledContainer>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        Fingerprint Data Viewer
      </Typography>

      <StyledTabs position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="secondary"
          aria-label="tabs for fingerprint data"
        >
          <Tab label="Enrolled Data" value="enroll" />
          <Tab label="Scan Data" value="scan" />
          <Tab label="Template Count" value="count" />
        </Tabs>
      </StyledTabs>

      {currentTab === "enroll" && (
        <StyledCard>
          <CardContentWrapper>
            <SectionHeader>Saved Fingerprints</SectionHeader>
            {enrolledFingerprints.length > 0 ? (
              enrolledFingerprints.map((record, index) => (
                <StyledCard key={index}>
                  <CardContentWrapper>
                    <Typography variant="h6" component="div">
                      Finger ID: {record.fingerId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Timestamp:{" "}
                      {new Date(record.timestamp).toLocaleString("en-US", {
                        timeZone: "Asia/Karachi",
                      })}
                    </Typography>

                    <StatusBox>
                      <FingerprintIcon color="primary" />
                      <Typography variant="body2" color="textSecondary">
                        Enrolled
                      </Typography>
                    </StatusBox>
                  </CardContentWrapper>
                </StyledCard>
              ))
            ) : (
              <Typography color="textSecondary">
                No enrolled fingerprints yet.
              </Typography>
            )}
          </CardContentWrapper>
        </StyledCard>
      )}

      {currentTab === "scan" && (
        <StyledCard>
          <CardContentWrapper>
            <SectionHeader>Scanned Fingerprints</SectionHeader>
            {scannedFingerprints.length > 0 ? (
              scannedFingerprints.map((record, index) => (
                <StyledCard key={index}>
                  <CardContentWrapper>
                    <Typography variant="h6" component="div">
                      Finger ID: {record.fingerId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Timestamp: {formatTimestamp(record.timestamp)}
                    </Typography>
                    <StatusBox>
                      {record.status === "success" ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <ErrorIcon color="error" />
                      )}
                      <Typography variant="body2" color="textSecondary">
                        Status: {record.status}
                      </Typography>
                    </StatusBox>
                  </CardContentWrapper>
                </StyledCard>
              ))
            ) : (
              <Typography color="textSecondary">
                No scanned fingerprints yet.
              </Typography>
            )}
          </CardContentWrapper>
        </StyledCard>
      )}

      {currentTab === "count" && (
        <StyledCard>
          <CardContentWrapper>
            <SectionHeader>Template Count</SectionHeader>
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              Total Templates:{" "}
              {templateCount !== null ? templateCount : "Loading..."}
            </Typography>
          </CardContentWrapper>
        </StyledCard>
      )}
    </StyledContainer>
  );
}

export default Fingerprint;
