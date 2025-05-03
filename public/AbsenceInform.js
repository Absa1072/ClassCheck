// Error Types
class UserNotFoundError extends Error {
    constructor(netID) {
        super(`Student with netID ${netID} not found`);
        this.name = "UserNotFoundError";
    }
}

class ClassSessionNotFoundError extends Error {
    constructor(courseName) {
        super(`Class session for course "${courseName}" not found`);
        this.name = "ClassSessionNotFoundError";
    }
}

class NotificationSendFailure extends Error {
    constructor() {
        super("Failed to send absence notification");
        this.name = "NotificationSendFailure";
    }
}

// replace getClassSession with actual API
async function getClassSession(courseName, date) {
    if (!courseName || courseName === "INVALID") throw new ClassSessionNotFoundError(courseName);
    return {
        courseName,
        location: { latitude: 40.7128, longitude: -74.0060 },
        sessionDate: date,
        sessionTime: "10:00 AM"
    };
}

// replace getName with actual API
async function getName(netID) {
    if (!netID || netID === "invalid123") throw new UserNotFoundError(netID);
    return "John Doe";
}
// replace getAttendanceReports with actual API
async function getAttendanceReports(netID, date) {
    if (netID === "noRecords123") return [];
    return [{ date, status: "absent" }];
}
// replace sendNotification with actual API 
async function sendNotification(message) {
    const success = true; // Change to false to simulate failure
    if (!success) throw new NotificationSendFailure();
    console.log("Notification sent:", message);
}

// AbsenceInform Function
async function AbsenceInform(netID, date, courseName) {
    if (!netID || !date) {
        console.error("Unable to send message: Missing netID or date");
        return { error: "Missing netID or date" };
    }

    try {
        const classSession = await getClassSession(courseName, date);
        const studentName = await getName(netID);
        const records = await fetchAttendanceReports(netID, date);

        if (!records || records.length === 0) {
            console.error("Unable to generate message: No attendance records found");
            return { error: "No attendance records found" };
        }

        const message = `${studentName} (${netID}) was absent on ${date} in ${classSession.courseName}`;
        await sendNotification(`${studentName}: ${message}`);

        return { success: true, message };
    } catch (error) {
        console.error(error.message);
        return { error: error.message };
    }
}

module.exports = { AbsenceInform }; 

