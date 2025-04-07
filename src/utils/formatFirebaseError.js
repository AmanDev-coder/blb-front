export const formatFirebaseError = (code) => {
     const errorMap = {
      "auth/invalid-credential": "Incorrect email or password. Please try again.",
      "auth/user-not-found": "No account found with this email. Please sign up.",
      "auth/wrong-password": "Incorrect password. Try again.",
      "auth/invalid-email": "Invalid email format. Please enter a valid email.",
      "auth/user-disabled": "This account has been disabled. Contact support.",
      "auth/network-request-failed": "Network error. Check your internet connection.",
      "auth/too-many-requests": "Too many failed attempts. Please try again later.",
       "auth/email-already-in-use": "This email is already registered. Try logging in.",
       "auth/weak-password": "Your password is too weak. Please use a stronger password.",
       "auth/internal-error": "Internal server error. Please try again later.",
     };
   
     return errorMap[code] || "An unknown error occurred. Please try again.";
   };
   