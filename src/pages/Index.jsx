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
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(UPLOAD_STATUS.IDLE);
  const [jobId, setJobId] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setUploadStatus(UPLOAD_STATUS.UPLOADING);
    try {
      const { jobId } = await mockUploadFile(file);
      setJobId(jobId);
      setUploadStatus(UPLOAD_STATUS.PROCESSING);
      pollJobStatus(jobId);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(UPLOAD_STATUS.ERROR);
    }
  };

  const pollJobStatus = async (jobId) => {
    try {
      const { status, resultUrl } = await mockPollJobStatus(jobId);
      if (status === "PROCESSING") {
        setProgress((prevProgress) => prevProgress + 10);
        setTimeout(() => pollJobStatus(jobId), 1000);
      } else if (status === "SUCCESS") {
        setUploadStatus(UPLOAD_STATUS.SUCCESS);
        setResultUrl(resultUrl);
      }
    } catch (error) {
      console.error("Poll error:", error);
      setUploadStatus(UPLOAD_STATUS.ERROR);
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Upload MP4 File
      </Text>
      <Input type="file" accept=".mp4" onChange={handleFileChange} mb={4} />
      <Button leftIcon={<FaUpload />} colorScheme="blue" onClick={handleUpload} isLoading={uploadStatus === UPLOAD_STATUS.UPLOADING} loadingText="Uploading..." disabled={!file}>
        Upload
      </Button>
      {uploadStatus === UPLOAD_STATUS.PROCESSING && (
        <Box mt={4}>
          <Text>Processing...</Text>
          <Progress value={progress} mt={2} />
        </Box>
      )}
      {uploadStatus === UPLOAD_STATUS.SUCCESS && (
        <Box mt={4}>
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
        <Alert status="error" mt={4}>
          <AlertIcon />
          An error occurred. Please try again.
        </Alert>
      )}
    </Box>
  );
};

export default Index;
