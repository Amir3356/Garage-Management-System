// Response patterns and generators
const responses = {
  greetings: {
    pattern: /^(hi|hello|hey|good morning|good afternoon|good evening|howdy|greetings|sup|yo)[\s!?]*$/,
    replies: [
      "Hello! Welcome to our Garage Management System. How can I assist you today? 😊",
      "Hi there! I'm here to help with your vehicle service needs. What can I do for you?",
      "Hey! Ready to help you with appointments, vehicles, or services. What do you need?"
    ]
  },
  
  howAreYou: {
    pattern: /how are you|how're you|how r u|what's up|whats up|wassup/,
    reply: "I'm doing great, thanks for asking! 😊 I'm here and ready to help you with your garage needs. What can I assist you with today?"
  },
  
  capabilities: {
    pattern: /what (can|do) you (do|help)|your (capabilities|features)|tell me about yourself/,
    reply: "I'm your Garage Management Assistant! I can help you with:\n\n📅 **Appointments** - Schedule, check status, or cancel\n🚗 **Vehicles** - Add, view, or manage your vehicles\n🔧 **Services** - Learn about repairs, maintenance, pricing\n📊 **Status Updates** - Track your service progress\n💬 **Questions** - Answer any garage-related queries\n\nWhat would you like to do?"
  }
};

const appointmentResponses = {
  howTo: "**Booking an Appointment is Easy!** 📅\n\n1. Navigate to the 'Appointments' page\n2. Select your vehicle from the list\n3. Choose the service you need\n4. Pick your preferred date and time\n5. Submit your request\n\nThe admin will review and confirm your appointment. You'll see the status in your Dashboard!",
  
  modify: "**To modify your appointment:**\n\n1. Go to your Dashboard or History page\n2. Find the appointment you want to change\n3. Contact the admin for modifications\n\n💡 **Tip:** Try to make changes at least 24 hours in advance!",
  
  general: "I can help you with appointments! Would you like to:\n• Learn how to book an appointment?\n• Check your appointment status?\n• Cancel or modify an appointment?\n\nJust let me know!"
};

const vehicleResponses = {
  add: "**Adding a New Vehicle** 🚗\n\n1. Go to 'My Vehicles' page\n2. Click the 'Add Vehicle' button\n3. Fill in the details:\n   • Vehicle name/model\n   • License plate number\n   • Any other relevant info\n4. Save your vehicle\n\nOnce added, you can use it to book appointments!",
  
  edit: "**Updating Vehicle Information:**\n\n1. Navigate to 'My Vehicles'\n2. Find the vehicle you want to update\n3. Click the edit button\n4. Make your changes\n5. Save\n\nYou can update vehicle details anytime!",
  
  delete: "**Removing a Vehicle:**\n\n1. Go to 'My Vehicles' page\n2. Find the vehicle you want to remove\n3. Click the delete/remove option\n\n⚠️ **Note:** Make sure you don't have any pending appointments for that vehicle!",
  
  general: "I can help you manage your vehicles! You can:\n• Add a new vehicle\n• View all your vehicles\n• Edit vehicle information\n• Remove a vehicle\n\nWhat would you like to do?"
};

const serviceResponses = {
  pricing: "**Service Pricing** 💰\n\nPrices vary by service type. You can see exact pricing when booking an appointment:\n\n1. Go to Appointments page\n2. Select a service\n3. View the price before confirming\n\nWe believe in transparent pricing - no hidden fees!",
  
  types: "**Our Services** 🔧\n\nWe offer comprehensive vehicle services:\n\n• 🛢️ Oil changes & fluid checks\n• 🔩 Engine diagnostics & repairs\n• 🚗 Brake system services\n• 🛞 Tire services\n• 🔍 General inspections\n• ⚙️ Transmission services\n• 🔋 Battery & electrical work\n\nCheck the Appointments page for the complete list!",
  
  general: "I can help with service information! Are you looking for:\n• Service types we offer?\n• Pricing information?\n• Service recommendations?\n• How to book a service?\n\nLet me know!"
};

const statusResponse = "**Checking Your Appointment Status** 📊\n\n1. Go to your Dashboard or History page\n2. View all your appointments\n\n**Status Indicators:**\n🟡 **Pending** - Awaiting admin approval\n🔵 **In Progress** - Currently being worked on\n🟢 **Completed** - Service finished, ready for pickup\n🔴 **Cancelled** - Appointment was cancelled";

const paymentResponse = "**Payment Information** 💳\n\nPayment details:\n• You'll receive an invoice after service completion\n• Check your Dashboard for invoices\n• Payment methods are handled by the garage\n• Contact the admin for specific payment questions";

const hoursResponse = "**Operating Hours** 🕐\n\nFor our current operating hours:\n• Check your Dashboard for contact information\n• Contact the garage directly\n• Hours may vary by location\n\nWhen booking an appointment, you'll see available time slots!";

const contactResponse = "**Contact Information** 📞\n\nTo reach the garage:\n• Check your Dashboard for contact details\n• Phone and email are available there\n• You can also message through the system\n• Visit in person during operating hours";

const durationResponse = "**Service Duration** ⏱️\n\nTypical service times:\n• Oil change: 30-45 minutes\n• Basic maintenance: 30-60 minutes\n• Brake service: 1-2 hours\n• Major repairs: 2-4+ hours\n\nYou'll get an estimate when booking!";

const helpResponse = "I'm here to help! I can assist you with:\n\n📅 **Appointments** - Booking, checking status, modifications\n🚗 **Vehicles** - Adding, viewing, managing\n🔧 **Services** - Types, pricing, recommendations\n📊 **Status** - Tracking your service progress\n💳 **Payments** - Invoice information\n📞 **Contact** - Getting in touch\n\nWhat do you need help with?";

const defaultResponse = "I'm specialized in helping with garage and vehicle services. I'm excellent at helping with:\n\n📅 **Appointments** - Scheduling and management\n🚗 **Vehicles** - Adding and tracking your vehicles\n🔧 **Services** - Information about repairs and maintenance\n📊 **Status** - Tracking your service progress\n\nHow can I help with your vehicle needs today?";

// Helper functions
const checkPattern = (input, keywords) => {
  return keywords.some(keyword => input.includes(keyword));
};

const getRandomReply = (replies) => {
  return replies[Math.floor(Math.random() * replies.length)];
};

// Main response generator
export const generateResponse = (userInput) => {
  const input = userInput.toLowerCase().trim();
  
  // Check simple patterns
  if (responses.greetings.pattern.test(input)) {
    return getRandomReply(responses.greetings.replies);
  }
  
  if (responses.howAreYou.pattern.test(input)) {
    return responses.howAreYou.reply;
  }
  
  if (responses.capabilities.pattern.test(input)) {
    return responses.capabilities.reply;
  }
  
  // Appointment related
  if (checkPattern(input, ['appointment', 'book', 'schedule', 'reserve'])) {
    if (checkPattern(input, ['how', 'what', 'where', 'can i'])) {
      return appointmentResponses.howTo;
    }
    if (checkPattern(input, ['cancel', 'change', 'modify', 'reschedule'])) {
      return appointmentResponses.modify;
    }
    return appointmentResponses.general;
  }
  
  // Vehicle related
  if (checkPattern(input, ['vehicle', 'car', 'truck', 'motorcycle', 'bike', 'auto'])) {
    if (checkPattern(input, ['add', 'new', 'register', 'create'])) {
      return vehicleResponses.add;
    }
    if (checkPattern(input, ['edit', 'update', 'change', 'modify'])) {
      return vehicleResponses.edit;
    }
    if (checkPattern(input, ['delete', 'remove'])) {
      return vehicleResponses.delete;
    }
    return vehicleResponses.general;
  }
  
  // Service related
  if (checkPattern(input, ['service', 'repair', 'maintenance', 'fix', 'work', 'problem'])) {
    if (checkPattern(input, ['price', 'cost', 'how much', 'fee', 'charge'])) {
      return serviceResponses.pricing;
    }
    if (checkPattern(input, ['what', 'which', 'types', 'kind', 'available', 'offer'])) {
      return serviceResponses.types;
    }
    return serviceResponses.general;
  }
  
  // Status
  if (checkPattern(input, ['status', 'progress', 'check', 'track']) && 
      checkPattern(input, ['appointment', 'service', 'car', 'vehicle'])) {
    return statusResponse;
  }
  
  // Payment
  if (checkPattern(input, ['pay', 'payment', 'invoice', 'bill'])) {
    return paymentResponse;
  }
  
  // Hours
  if (checkPattern(input, ['hours', 'open', 'close', 'timing'])) {
    return hoursResponse;
  }
  
  // Contact
  if (checkPattern(input, ['contact', 'phone', 'email', 'call', 'reach'])) {
    return contactResponse;
  }
  
  // Duration
  if (checkPattern(input, ['how long', 'duration', 'take', 'wait', 'time'])) {
    return durationResponse;
  }
  
  // Thank you
  if (checkPattern(input, ['thank', 'thanks'])) {
    return "You're very welcome! 😊 Happy to help anytime!";
  }
  
  // Goodbye
  if (checkPattern(input, ['bye', 'goodbye', 'see you'])) {
    return "Goodbye! 👋 Feel free to come back anytime you need help. Drive safe!";
  }
  
  // Help
  if (input.includes('help')) {
    return helpResponse;
  }
  
  // Check if garage-related
  const garageKeywords = ['garage', 'appointment', 'vehicle', 'car', 'service', 'repair', 
                         'maintenance', 'booking', 'schedule', 'mechanic', 'oil', 'tire', 
                         'brake', 'engine', 'inspection'];
  
  if (garageKeywords.some(keyword => input.includes(keyword))) {
    return "I'd be happy to help with that! Could you provide more details? I can assist with:\n\n📅 Booking & managing appointments\n🚗 Vehicle management\n🔧 Service information & pricing\n📊 Checking appointment status\n\nWhat specifically would you like to know?";
  }
  
  return defaultResponse;
};
