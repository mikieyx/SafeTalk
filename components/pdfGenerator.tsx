"use client";

import { Call } from "@prisma/client";
import { jsPDF } from "jspdf";
import { Button } from "./ui/button";

const GeneratePDF = ({ call }: { call: Call }) => {
  const handleGeneratePDF = () => {
    if (!call) {
      return alert("No call data provided.");
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Emergency Call Evidence Report", 20, 20);
    doc.setFontSize(12);
    doc.text("Date: " + new Date().toLocaleDateString(), 20, 30);

    // User Information
    doc.setFontSize(14);
    doc.text("User Information:", 20, 50);
    doc.setFontSize(12);
    doc.text("Phone Number: " + call.user_phone_number, 20, 60);

    // Call Information
    doc.setFontSize(14);
    doc.text("Call Information:", 20, 80);
    doc.setFontSize(12);
    doc.text(
      "Call Start Time: " + new Date(call.start_time).toLocaleString(),
      20,
      90
    );
    doc.text(
      "Call End Time: " +
        (call.end_time ? new Date(call.end_time).toLocaleString() : "Ongoing"),
      20,
      100
    );

    // Transcript with text wrapping
    const transcript = call.transcript || "N/A";
    const transcriptLines = doc.splitTextToSize(transcript, 170); // Adjust width as needed

    doc.text("Transcript:", 20, 110);

    let yOffset = 120;
    transcriptLines.forEach((line : string) => {
      doc.text(line, 20, yOffset);
      yOffset += 10; // Adjust spacing as needed
    });

    // Stress Level and Location Data
    doc.text("Stress Level Over Time:", 20, yOffset + 10);
    doc.text("[Stress Level Data Placeholder]", 20, yOffset + 20);

    doc.text("Location Over Time:", 20, yOffset + 40);
    doc.text("[Location Data Placeholder]", 20, yOffset + 50);

    // Emergency Contacts
    doc.setFontSize(14);
    doc.text("Emergency Contacts:", 20, yOffset + 70);
    doc.setFontSize(12);
    doc.text("Contacted at: " + (`${call.contacts_notified ? call.contacts_notified.toLocaleString() : "N/A"}`), 20, yOffset + 80);

    // Authorities
    doc.setFontSize(14);
    doc.text("Authorities Contacted:", 20, yOffset + 110);
    doc.setFontSize(12);
    doc.text(
      "Contacted at: " + (`${call.authorities_notified ? call.authorities_notified.toLocaleString() : "N/A"}`),
      20,
      yOffset + 120
    );
    doc.text("Contact Time: [Time Placeholder]", 20, yOffset + 130);

    // Footer
    doc.setFontSize(10);

    const footerText =
      "This document serves as an evidence report of the emergency call made on " +
      new Date(call.start_time).toLocaleDateString();

    const footerLines = doc.splitTextToSize(footerText, 170); // Adjust width as needed
    footerLines.forEach((line : string) => {
      yOffset += 10;
      doc.text(line, 20, yOffset + 150);
    });

    // Save the PDF
    doc.save("Emergency_Call_Evidence_Report.pdf");
  };

  return <Button onClick={handleGeneratePDF}>Generate PDF</Button>;
};

export default GeneratePDF;
