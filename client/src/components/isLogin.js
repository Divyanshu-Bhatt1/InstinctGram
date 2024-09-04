import axios from 'axios';

const checkAuth = async (navigate) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/isLogin`, {
      withCredentials: true 
    });
    
    if (response.status !== 200) {
      navigate('/');
    } else {
      console.log("You are successfully logged in!");
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    navigate('/');
  }
};

export default checkAuth;
