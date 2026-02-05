import axios from 'axios';

export const handleLinkClick = async (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  endpoint: string,
  route: string,
  navigate: (path: string, state?: object) => void
) => {
    event.preventDefault();

    try {
        const response = await axios.get(`/api/${endpoint}`);
        navigate(`/${route}`, { state: { [route]: response.data.data } });
        window.scrollTo(0, 0);
    } catch (error) {
        console.error(`Error al obtener ${endpoint}:`, error);
    }
};
