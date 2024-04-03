import { useState } from "react";
import { Box, Button, Text, Input, Progress, Link, Alert, AlertIcon } from "@chakra-ui/react";
import { FaUpload, FaDownload } from "react-icons/fa";

const UPLOAD_STATUS = {
  IDLE: "IDLE",
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const mockUploadFile = async (file) => {
  // Mock API call to upload the file
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { jobId: "job_123" };
};

const mockPollJobStatus = async (jobId) => {
  // Mock API call to poll the job status
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const status = Math.random() < 0.8 ? "PROCESSING" : "SUCCESS";
  return { status, resultUrl: status === "SUCCESS" ? "/path/to/result.fbx" : null };
};

const Index = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatuses, setUploadStatuses] = useState({});
  const [jobIds, setJobIds] = useState({});
  const [resultUrls, setResultUrls] = useState({});
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    files.forEach(async (file) => {
      const fileId = file.name;
      setUploadStatuses((prevStatuses) => ({ ...prevStatuses, [fileId]: UPLOAD_STATUS.UPLOADING }));
      try {
        const { jobId } = await mockUploadFile(file);
        setJobIds((prevJobIds) => ({ ...prevJobIds, [fileId]: jobId }));
        setUploadStatuses((prevStatuses) => ({ ...prevStatuses, [fileId]: UPLOAD_STATUS.PROCESSING }));
        pollJobStatus(jobId, fileId);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadStatuses((prevStatuses) => ({ ...prevStatuses, [fileId]: UPLOAD_STATUS.ERROR }));
      }
    });
  };

  const pollJobStatus = async (jobId, fileId) => {
    try {
      const { status, resultUrl } = await mockPollJobStatus(jobId);
      if (status === "PROCESSING") {
        setTimeout(() => pollJobStatus(jobId, fileId), 1000);
      } else if (status === "SUCCESS") {
        setUploadStatuses((prevStatuses) => ({ ...prevStatuses, [fileId]: UPLOAD_STATUS.SUCCESS }));
        setResultUrls((prevResultUrls) => ({ ...prevResultUrls, [fileId]: resultUrl }));
      }
    } catch (error) {
      console.error("Poll error:", error);
      setUploadStatuses((prevStatuses) => ({ ...prevStatuses, [fileId]: UPLOAD_STATUS.ERROR }));
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Upload MP4 File
      </Text>
      <Input type="file" accept=".mp4" onChange={handleFileChange} mb={4} multiple />
      <Button leftIcon={<FaUpload />} colorScheme="blue" onClick={handleUpload} disabled={files.length === 0}>
        Upload
      </Button>
      {files.map((file) => {
        const fileId = file.name;
        const uploadStatus = uploadStatuses[fileId];
        const resultUrl = resultUrls[fileId];

        return (
          <Box key={fileId} mt={4}>
            <Text fontWeight="bold">{file.name}</Text>
            {uploadStatus === UPLOAD_STATUS.PROCESSING && <Text>Processing...</Text>}
            {uploadStatus === UPLOAD_STATUS.SUCCESS && (
              <Box>
                <Alert status="success">
                  <AlertIcon />
                  File processed successfully!
                </Alert>
                <Link href={resultUrl} download mt={2}>
                  <Button leftIcon={<FaDownload />} colorScheme="green">
                    Download Result
                  </Button>
                </Link>
              </Box>
            )}
            {uploadStatus === UPLOAD_STATUS.ERROR && (
              <Alert status="error" mt={2}>
                <AlertIcon />
                An error occurred. Please try again.
              </Alert>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Index;
