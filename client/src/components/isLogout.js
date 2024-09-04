import axios from 'axios';

const checkAuth1 = async (navigate) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/isLogout`, {
      withCredentials: true 
    });
    
    if (response.status !== 200) {
      navigate('/home');
    } else {
      console.log("Add your credentials!");
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    navigate('/');
  }
};

export default checkAuth1;
