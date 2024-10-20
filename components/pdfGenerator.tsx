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

    // User Information (from the call prop)
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
    doc.text("Transcript: " + (call.transcript || "N/A"), 20, 110);

    doc.text("Stress Level Over Time: ", 20, 130);
    doc.text("[Stress Level Data Placeholder]", 20, 140);

    doc.text("Location Over Time: ", 20, 160);
    doc.text("[Location Data Placeholder]", 20, 170);

    // Emergency Contacts
    doc.setFontSize(14);
    doc.text("Emergency Contacts:", 20, 190);
    doc.setFontSize(12);
    doc.text("Contacted: " + (call.contacts_notified ? "Yes" : "No"), 20, 200);
    doc.text("Contact Time: [Time Placeholder]", 20, 210); // Add actual contact time if available

    // Authorities
    doc.setFontSize(14);
    doc.text("Authorities Contacted:", 20, 230);
    doc.setFontSize(12);
    doc.text(
      "Contacted: " + (call.authorities_notified ? "Yes" : "No"),
      20,
      240
    );
    doc.text("Contact Time: [Time Placeholder]", 20, 250); // Add actual authority contact time if available

    // Footer
    doc.setFontSize(10);
    doc.text(
      "This document serves as an evidence report of the emergency call made on " +
        new Date(call.start_time).toLocaleDateString(),
      20,
      270
    );

    // Save the PDF
    doc.save("Emergency_Call_Evidence_Report.pdf");
  };

  return <Button onClick={handleGeneratePDF}>Generate PDF</Button>;
};

export default GeneratePDF;
