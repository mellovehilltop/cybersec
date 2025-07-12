# cybersec
Hilltop Honey Cyber Security Training
Code Generation for Interactive Security Training
Act as an expert front-end web developer specializing in creating engaging, interactive educational experiences. Your task is to generate the complete HTML, CSS, and JavaScript code for a single-page, scrolling, interactive cybersecurity training module.
Project High-Level Goal:
Create a mandatory corporate training module that is fun, interactive, and gamified to ensure completion. The theme is "Project: Digital Shield," where the employee is a "Field Agent" learning to protect themselves and the organization. The training must be modular, and the user must complete each module before the next one is unlocked.
Technical Specifications:
Frameworks: Use only vanilla HTML, CSS, and JavaScript. Do not use any external libraries or frameworks (like React, Vue, or jQuery) to ensure simplicity and portability.
Structure: A single index.html file, a single style.css file, and a single script.js file.
Responsiveness: The layout must be fully responsive and work well on both desktop and mobile devices.
Progression: The page should be divided into distinct <section> elements for each mission. By default, only the first mission is visible. A mission is "completed" after the user finishes its core interactive task. Upon completion, the next section/mission automatically becomes visible, and the page scrolls down to it.
State Management: Use the browser's localStorage to save the user's progress. If they close the tab and reopen it, they should be able to resume from the last completed mission.
Placeholders: Use clear comments in the code for assets that need to be added later (e.g., <!-- Placeholder for mission briefing video -->, <!-- Image for fake email 1 -->, etc.).
Detailed Module Breakdown (The Missions):
Mission 00: Your Briefing
Concept: A "TOP SECRET" mission briefing to introduce the training.
Content: A title "Project: Digital Shield" and a short introductory paragraph. "Agent, your mission is to master the arts of digital defense. The following modules contain the intel you need to protect our network and yourself. Complete each mission to become a certified agent."
Interactive Element: A button labeled [ACCEPT MISSION]. Clicking this button marks Mission 00 as complete and reveals Mission 01.
Mission 01: The Interrogation Room (Identifying Fake Emails)
Concept: A simulator where the agent must analyze emails and spot fakes.
Content: Based on the "Identifying Fake Emails" and "Common Scams" slides.
Interactive Element: A mock inbox interface displays one email at a time. The user is presented with 3-4 example emails (some legitimate, some fake).
For each email, provide two buttons: [TRUST] and [DELETE].
If [DELETE] is clicked on a fake email: Show a "Correct!" message.
If [TRUST] is clicked on a fake email: Show a "THREAT DETECTED!" message and visually highlight the red flags in the email (e.g., put a red box around the non-official sender address, the generic greeting "Dear Customer", and the urgent call to action).
After analyzing all emails, a [MISSION COMPLETE] button appears.
Mission 02: The Vault (Password Security)
Concept: A mini-game about creating and managing strong passwords.
Content: Covers password length, complexity (characters, numbers, symbols), uniqueness, and the danger of re-using passwords.
Interactive Element: A "Password Strength Tester" game.
An input field where the user can type a password.
Below it, a "strength meter" that goes from "WEAK" to "STRONG" in real-time as they type.
A checklist of requirements ([ ] 12+ Characters, [ ] Uppercase & Lowercase, [ ] Number, [ ] Symbol) that gets checked off as they meet the criteria.
Once the password reaches "STRONG," show a "VAULT SECURED" message and a [MISSION COMPLETE] button.
Mission 03: Field Operations (Safe Internet Use)
Concept: A scenario-based guide for staying safe while browsing the internet, especially on public networks.
Content: Covers HTTPS, public Wi-Fi dangers, and downloading files.
Interactive Element: A short "Choose Your Own Adventure" scenario.
Scene 1: "You are at a coffee shop and need to work. You see two Wi-Fi networks: 'Public_Cafe_WiFi' and your phone's 'SecureHotspot'. Which do you connect to?"
If they choose the public Wi-Fi, explain the risks of man-in-the-middle attacks. If they choose the hotspot, praise their good judgment.
Scene 2: "You visit a website to download a free PDF editor. The URL starts with http://. Is it safe to proceed?" Provide [PROCEED] and [LEAVE SITE] buttons. Explain the importance of HTTPS if they click either one.
After the final scene, show a [MISSION COMPLETE] button.
Mission 04: Secure Your Safehouse (Clear Desk & Computer Policy)
Concept: An interactive "I Spy" game to enforce physical and digital security at their workspace.
Content: Covers locking your computer, securing printed documents, and not writing down passwords.
Interactive Element: Display a static image of a messy office desk. The image should contain several security risks:
An unlocked computer screen.
A sticky note with "Password: P@ssword123" on the monitor.
A printed "Confidential Financial Report" sitting in plain view.
A smartphone left unattended on the desk.
The user must click on all 4 security risks. When a risk is clicked, it should be highlighted, and a short explanation of the risk should appear.
Once all risks are identified, show a "SAFEHOUSE SECURE" message and a [MISSION COMPLETE] button.
Mission 05: The Redaction Protocol (GDPR)
Concept: A mini-game about identifying and protecting Personally Identifiable Information (PII).
Content: Explains the basics of GDPR and the importance of handling personal data correctly.
Interactive Element: A "Redaction" game.
Show the user a sample block of text (e.g., a customer service email).
The text contains various pieces of PII (e.g., a name, email address, phone number, home address, credit card number).
The user must click on the words/phrases that constitute PII. When clicked, the text should be "redacted" (e.g., covered with a black bar).
Once all PII is correctly redacted, show a "SENSITIVE INTEL PROTECTED" message and a [MISSION COMPLETE] button.
Final Module: Emergency Protocols & Final Exam
Concept: A non-gamified, serious information hub for what to do in a real incident and to conclude the training.
Content: Based on the "What to Do If You're a Victim" slide.
Interactive Element:
Display three clear sections for "Report to Action Fraud," "Seek Support," and "Update Security," with the relevant contact info and instructions.
Below this, add a large button: [PROCEED TO FINAL CERTIFICATION EXAM].
This button should link externally to your Microsoft Forms quiz. Use the placeholder URL https://forms.office.com/YourQuizHere.
Include a concluding message: "Congratulations, Agent. You have completed your field training. Proceed to the final exam to earn your certification."
Please provide the complete code in three separate, clearly-labeled blocks: one for index.html, one for style.css, and one for script.js. Ensure the JavaScript is well-commented to explain the logic for progression and localStorage.
