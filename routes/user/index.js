const router = require("express").Router();

const {
  getAllGems,
  getAllQuestions,
  createComplaint,
  getContacts,
  getStories,
  linkCouples,
  createRelationship,
  sendLoveClick,
  addExperience,
  getPublishedExperiences,
  getUserData,
  editProfile,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  confirmConnection,
  getPersonsAnalytics,
  updateUserKind,
  getPartnerTasks,
  sayTaskNotification,
  getRelationship,
} = require("../../controllers/user/index");
const verifyToken = require("../../middlewares/verifyToken");

/**
 * @swagger
 * /user/gems:
 *   get:
 *     summary: Retrieve all gems bundles
 *     tags:
 *       - Gems
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of gems bundles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gemsBundles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the gem bundle
 *                       name:
 *                         type: string
 *                         description: Name of the gem bundle
 *                       price:
 *                         type: number
 *                         description: Price of the gem bundle
 *                       count:
 *                         type: number
 *                         description: Count of gems in the bundle
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the gem bundle was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the gem bundle was last updated
 *       500:
 *         description: Internal server error
 */
router.get("/gems", getAllGems);

/**
 * @swagger
 * /user/questions:
 *   get:
 *     summary: Retrieve a list of all questions
 *     description: Retrieve a list of questions along with their answers.
 *     responses:
 *       200:
 *         description: A list of questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The question ID.
 *                     example: 60c72b2f4f1a2c001f8e4b1e
 *                   question:
 *                     type: string
 *                     description: The question text.
 *                     example: "What is the capital of France?"
 *                   answer:
 *                     type: string
 *                     description: The answer to the question.
 *                     example: "Paris"
 *       500:
 *         description: Internal server error.
 */

router.get("/questions", getAllQuestions);

/**
 * @swagger
 * /user/create-Complaint:
 *   post:
 *     summary: Create a new complaint
 *     description: Endpoint to create a new complaint. Requires name, email, and message in the request body.
 *     tags:
 *       - Complaints
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person making the complaint.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email address of the person making the complaint.
 *                 example: john.doe@example.com
 *               message:
 *                 type: string
 *                 description: The content of the complaint.
 *                 example: "I am not happy with the service."
 *             required:
 *               - name
 *               - email
 *               - message
 *     responses:
 *       201:
 *         description: Complaint created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Complaint created successfully."
 *                 complaint:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the complaint.
 *                       example: "607d0d5c3f2e1c001f6471d7"
 *                     name:
 *                       type: string
 *                       description: Name of the person making the complaint.
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       description: Email address of the person making the complaint.
 *                       example: "john.doe@example.com"
 *                     message:
 *                       type: string
 *                       description: The content of the complaint.
 *                       example: "I am not happy with the service."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the complaint was created.
 *                       example: "2024-07-21T15:21:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the complaint was last updated.
 *                       example: "2024-07-21T15:21:00Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Validation error: Missing required fields."
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server error occurred."
 */

router.post("/create-Complaint", createComplaint);
/**
 * @swagger
 * /user/get-contacts:
 *   get:
 *     summary: Retrieve a list of all contacts
 *     description: Retrieve a list of all contacts, including their names, email addresses, and messages.
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: A list of contacts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the contact.
 *                     example: "607c35f7a4d0b0b11c0e5d3e"
 *                   name:
 *                     type: string
 *                     description: The name of the contact.
 *                     example: "Jane Doe"
 *                   email:
 *                     type: string
 *                     description: The email address of the contact.
 *                     example: "jane.doe@example.com"
 *                   message:
 *                     type: string
 *                     description: The message from the contact.
 *                     example: "I have a question about your service."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the contact was created.
 *                     example: "2024-07-21T15:21:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the contact was last updated.
 *                     example: "2024-07-21T15:21:00Z"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server error occurred."
 */
router.get("/get-contacts", getContacts);
/**
 * @swagger
 * /api/user/get-stories:
 *   get:
 *     summary: Retrieve a list of all stories
 *     description: Retrieve a list of stories with their details.
 *     tags:
 *       - Stories
 *     responses:
 *       200:
 *         description: A list of stories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The story ID.
 *                     example: 60c72b2f4f1a2c001f8e4b1e
 *                   name:
 *                     type: string
 *                     description: The name of the story.
 *                     example: "The Adventure Begins"
 *                   Content:
 *                     type: string
 *                     description: The content of the story.
 *                     example: "Once upon a time..."
 *                   jewelCount:
 *                     type: number
 *                     description: The number of jewels required to unlock the story.
 *                     example: 5
 *                   isPaid:
 *                     type: boolean
 *                     description: Indicates if the story is paid or free.
 *                     example: true
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the story was created.
 *                     example: "2024-07-21T15:21:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the story was last updated.
 *                     example: "2024-07-21T15:21:00Z"
 *       500:
 *         description: Internal server error.
 */
router.get("/get-stories", getStories);

/**
 * @swagger
 * /api/user/linkCouples:
 *   post:
 *     summary: Link two user accounts
 *     description: This endpoint links two user accounts based on a linkedWord. If both users have the same linkedWord, their relationship status is set to "accepted".
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkedWord:
 *                 type: string
 *                 description: The word used to link two user accounts.
 *                 example: "magicword"
 *     responses:
 *       200:
 *         description: Successfully linked users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: A message describing the result of the operation.
 *                   example: "linked successfully"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: "linkedWord is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: "Invalid authorization"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: A message describing the error.
 *                   example: "Server Error"
 */

router.post("/linkCouples", verifyToken, linkCouples);

/**
 * @swagger
 * /api/user/create-relation:
 *   post:
 *     summary: Create a new relationship between the current user and their partner
 *     description: Endpoint to create a new relationship. The partner is determined from the user's `partner` field. The relationship status of both users is updated to "completed".
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               engagementDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the engagement.
 *                 example: "2024-07-20"
 *               marriageDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the marriage.
 *                 example: "2024-12-25"
 *               proposalDate:
 *                 type: string
 *                 format: date
 *                 description: Date of the proposal.
 *                 example: "2024-06-15"
 *     responses:
 *       '201':
 *         description: Relationship created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Relationship created successfully"
 *                 relationship:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the relationship.
 *                       example: "60c72b2f4f1a2c001f8e4b1f"
 *                     user1:
 *                       type: string
 *                       description: The ID of the first user.
 *                       example: "60c72b2f4f1a2c001f8e4b1e"
 *                     user2:
 *                       type: string
 *                       description: The ID of the second user (partner).
 *                       example: "60c72b2f4f1a2c001f8e4b1d"
 *                     engagementDate:
 *                       type: string
 *                       format: date
 *                       description: Date of the engagement.
 *                       example: "2024-07-20"
 *                     marriageDate:
 *                       type: string
 *                       format: date
 *                       description: Date of the marriage.
 *                       example: "2024-12-25"
 *                     proposalDate:
 *                       type: string
 *                       format: date
 *                       description: Date of the proposal.
 *                       example: "2024-06-15"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the relationship was created.
 *                       example: "2024-07-21T15:21:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the relationship was last updated.
 *                       example: "2024-07-21T15:21:00Z"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Partner not found for the user."
 *       '404':
 *         description: User or partner not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "User or partner not found."
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server error occurred."
 */

router.post("/create-relation", verifyToken, createRelationship);

/**
 * @swagger
 * /api/experience/create-experience:
 *   post:
 *     summary: Create a new experience
 *     description: Endpoint to create a new experience. Admins can provide details like name, content, and other related information to create an experience.
 *     tags:
 *       - Experiences
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the experience.
 *                 example: "Adventure in the Alps"
 *               content:
 *                 type: string
 *                 description: The content or description of the experience.
 *                 example: "A thrilling journey through the Alps with breathtaking views."
 *               userName:
 *                 type: string
 *                 description: The name of the user who created the experience.
 *                 example: "John Doe"
 *               userEmail:
 *                 type: string
 *                 description: The email of the user who created the experience.
 *                 example: "john.doe@example.com"
 *     responses:
 *       '201':
 *         description: Experience created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Experience created successfully"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Invalid input data."
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server error occurred."
 */

router.post("/create-experience", addExperience);
/**
 * @swagger
 * /api/user/experiences:
 *   get:
 *     summary: Get all published experiences
 *     description: Endpoint to retrieve all experiences with the status "published". Useful for displaying or managing published experiences.
 *     tags:
 *       - Experiences
 *     responses:
 *       '200':
 *         description: Successfully retrieved published experiences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: true
 *                 experiences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the experience.
 *                         example: "60c72b2f4f1a2c001f8e4b1e"
 *                       name:
 *                         type: string
 *                         description: The name of the experience.
 *                         example: "Adventure in the Alps"
 *                       content:
 *                         type: string
 *                         description: The content or description of the experience.
 *                         example: "A thrilling journey through the Alps with breathtaking views."
 *                       status:
 *                         type: string
 *                         enum: [publish, published]
 *                         description: The status of the experience.
 *                         example: "published"
 *                       userName:
 *                         type: string
 *                         description: The name of the user who created the experience.
 *                         example: "John Doe"
 *                       userEmail:
 *                         type: string
 *                         description: The email of the user who created the experience.
 *                         example: "john.doe@example.com"
 *                       jewelCount:
 *                         type: number
 *                         description: The number of jewels associated with the experience.
 *                         example: 5
 *                       isPaid:
 *                         type: boolean
 *                         description: Indicates if the experience is paid.
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the experience was created.
 *                         example: "2024-07-21T15:21:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the experience was last updated.
 *                         example: "2024-07-21T15:21:00Z"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server error occurred."
 */
router.get("/experiences", getPublishedExperiences);

/**
 * @swagger
 * /api/user/get-user:
 *   get:
 *     summary: Get all user data
 *     description: Endpoint to retrieve all experiences with the status "published". Useful for displaying or managing published experiences.
 *     tags:
 *       - Get User
 
 */
router.get("/get-user", verifyToken, getUserData);

/**
 * @swagger
 * /api/user/edit-profile:
 *   post:
 *     summary: edit  user data
 *     description: Endpoint to retrieve all experiences with the status "published". Useful for displaying or managing published experiences.
 *     tags:
 *       - Get User 
 *     responses:
 *       200:
 *         description: Successfully edit user data 
 * fullname: Name of the user
 * email: Email of the user
 * phone: Number of the user
 * password: password of the user
 * sex: sex of the user
 * age: age of the user
 *         
 
 */
router.post("/edit-profile", verifyToken, editProfile);

/**
 * @swagger
 * /api/user/send-message:
 *   post:
 *     summary: إرسال إشعار ضغطة شوق
 *     description: يرسل إشعار ضغطة شوق من المستخدم الحالي إلى شريكه ويخلق إشعارات لكل من المرسل والمستلم.
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: محتوى اختياري للإشعار.
 *                 example: "عناق دافئ"
 *     responses:
 *       '200':
 *         description: تم إرسال إشعار ضغطة الشوق بنجاح وإنشاء إشعارات لكل من المرسل والمستلم
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: حالة النجاح.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: رسالة تأكيد باسم الشريك.
 *                   example: "تم إرسال ضغطة الشوق بنجاح إلى Jane Smith"
 *                 response:
 *                   type: object
 *                   description: كائن استجابة Firebase.
 *       '400':
 *         description: طلب غير صحيح - الحقول المطلوبة مفقودة أو بيانات غير صالحة
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: حالة النجاح.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: رسالة الخطأ.
 *                   example: "طلب غير صحيح"
 *       '404':
 *         description: المستخدم أو الشريك غير موجود
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: حالة النجاح.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: رسالة الخطأ.
 *                   example: "لم يتم العثور على المستخدم أو الشريك"
 *       '500':
 *         description: خطأ في الخادم الداخلي
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: حالة النجاح.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: رسالة الخطأ.
 *                   example: "حدث خطأ في الخادم."
 *     components:
 *       securitySchemes:
 *         bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */
router.post("/send-message", verifyToken, sendLoveClick);
router.get("/confirm-connection", confirmConnection);
/**
 * @swagger
 * /api/user/get-user-notifications:
 *   get:
 *     summary: Retrieve user notifications and count unread messages
 *     description: Fetches all notifications for the currently logged-in user and provides a count of unread messages. Requires authentication via token.
 *     tags:
 *       - Notification
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved notifications and unread message count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: true
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Notification ID.
 *                         example: "60c72b2f4f1a2c001f8e4b1f"
 *                       type:
 *                         type: string
 *                         description: Type of notification.
 *                         example: "sendLove"
 *                       message:
 *                         type: string
 *                         description: Content of the notification.
 *                         example: "أنت أرسلت ضغطة شوق إلى Jane Smith"
 *                       isRead:
 *                         type: boolean
 *                         description: Read status of the notification.
 *                         example: false
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the notification was created.
 *                         example: "2024-07-21T15:21:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time when the notification was last updated.
 *                         example: "2024-07-21T15:21:00Z"
 *                 unreadCount:
 *                   type: integer
 *                   description: Number of unread notifications.
 *                   example: 5
 *       '401':
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Unauthorized access. Token is missing or invalid."
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: "Server error occurred."
 *     components:
 *       securitySchemes:
 *         bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

router.get("/get-user-notifications", verifyToken, getUserNotifications);

/**
 * @swagger
 * /api/user/mark-read/:notificationId:
 *   patch:
 *     summary: Mark notification as read
 *     description: Fetches all notifications for the currently logged-in user and provides a count of unread messages. Requires authentication via token.
 *     tags:
 *       - Notification
 
 */
router.post("/mark-read/:notificationId", verifyToken, markNotificationAsRead);

/**
 * @swagger
 * /api/user/mark-all-read:
 *   post:
 *     summary: Mark all notification as read
 *     description: Fetches all notifications for the currently logged-in user and provides a count of unread messages. Requires authentication via token.
 *     tags:
 *       - Notification
 
 */
router.post("/mark-all-read", verifyToken, markAllNotificationsAsRead);

/**
 * @swagger
 * /api/user/persons-analytics:
 *   get:
 *     summary: Get all persons analytics
 *     description: Fetches Persons Analytics
 *     tags:
 *       - personsAnalytics
 
 */
router.get("/persons-analytics", getPersonsAnalytics);

/**
 * @swagger
 * /api/user/update-user-kind:
 *   patch:
 *     summary: update user kind
 *     description: update user kind
 *     tags:
 *       - personsAnalytic_Update
 *     responses:
 *       200:
 *         description: Successfully edit user data
 *         content:
 *           application/json:
 * 
 
 */
router.patch("/update-user-kind", verifyToken, updateUserKind);

/**
 * @swagger
 * /api/user/get-partner-kind:
 *   get:
 *     summary: get partner kind
 *     description: get partner kind
 *     tags:
 *       - personsAnalytic_Update
 *     responses:
 *       200:
 *         description: Successfully edit user data
 *         content:
 *           application/json:
 * 
 
 */
router.get("/get-partner-kind", verifyToken, getPartnerTasks);

/**
 * @swagger
 * /api/user/complete-task:
 *   post:
 *     summary: Complete task
 *     description: Complete task
 *     tags:
 *       - personsAnalytic_Update
 *     responses:
 *       200:
 *         description: Successfully complete task
 *         content:
 *           application/json:
 * 
 
 */
router.post("/complete-task", verifyToken, sayTaskNotification);


  
router.get("/get-relation", verifyToken, getRelationship);



module.exports = router;
