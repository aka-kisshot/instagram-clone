import React, { FC, ReactElement, useEffect, useState } from "react";
import useLogout from "../../hooks/useLogout";
import { Post } from "../../types/Post";
import { User } from "../../types/User";
import PostCard from "../elements/PostCard";
import PostsGallery from "../elements/PostsGallery";
import VirtualScroll from "../elements/VirtualScroll";
import { BiLogOut } from "react-icons/bi";
import usePost from "../../hooks/usePost";

type Props = {
  user: User;
};

const Profile: FC<Props> = ({ user }): ReactElement => {
  const limit = 2;
  const buffer = limit * 3;
  const cache = buffer - limit;
  const [items, setItems] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { logoutUser } = useLogout();
  const { getUserPosts } = usePost();

  const callApi = (offset: number, limit: number) => {
    return getUserPosts();
  };

  useEffect(() => {
    setIsLoading(true);
    callApi(0, buffer).then((res: any) => {
      setItems(res);
      setIsLoading(false);
    });
  }, []);

  const prevCallback = async (newOffset: number) => {
    setIsLoading(true);

    const res = await callApi(newOffset, limit);
    const newItems = [...res, ...items.slice(0, cache)] as any;
    setItems(newItems);
    setIsLoading(false);
    return true;
  };

  const nextCallback = async (newOffset: number) => {
    setIsLoading(true);

    const res = await callApi(newOffset, limit);
    const newItems = [...items.slice(-cache), ...res] as any;
    setItems(newItems);
    setIsLoading(false);
    return true;
  };

  return (
    <VirtualScroll
      buffer={buffer}
      rowHeight={300}
      style="flex-grow overflow-y-scroll"
      limit={limit}
      onPrevCallback={prevCallback}
      onNextCallback={nextCallback}
      header={
        <div className="flex items-center justify-center m-4">
          <img
            src={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX8/PxZWlr///9WV1ff399cXV1VVlZQUVFFRkZKS0s9Pj5CQ0NOT09ERUX5+fn19fXs7Ow5OjouLy8zNDTW1tays7PLy8tyc3Orq6tpampkZWXd3d15eXm/v7+YmZmmpqaQkZGEhYUoKirn5+eMjY25urrHx8eWl5ceHx+AgYGCq/ltAAAHC0lEQVR4nO2daXeiShBApdqm6WZfBME1aszk///BB5rFROMCDRS+up8yTjzHO4XdVb3UjEYEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRBEHeCbvj+Kfg5aXhBsZ+PZNgi8J9OsbIJ0up7nhWEy0yjy+Xq6D55F8mD3xuw4tKUjTMaYKRxph7Ey39JgNHxJ8JIVV67DDM6Nb8o/MMdVfJV6w3YESDPLFj/tTiyFbWXpgBXBWxgb55LciaYTsVdvmI4AyXsojeuCVSRl+J4MMY4AS3nb7+BoSGs5PEVIeHSX39Ex4snAFOFVWPf6HRylMxmSIsAkFo8IlooingznSQX/ZXNxfrjuuHnxB6IIsAsf9qsUw5eBRBGWcR3BUjF+G4QhLKOilqBhFNHbAKIIk7CmX0U4RW8I441Z7xmt4OZmjFwRAvPBaeK3otgiV1yrJoKlor3rW+EqkIaskWBJmCIOIoBq9IwegihCxOMpTGvOhD8U4xVaQ9gys7GgYTC8gw2sGg4zR7haIjWEwNARQsMwTaRBhInSImgYCmmtCEJqMpQOyuEUxlHjufADFs1QGq5qVYWX4CHGsQb8vPFs/2UocoTlPiRSl2C1MIVw6Q0WrkZDd4HP0FvrGkkr5M7rW+gMP3M0GjqZ37fQbyDgQqOh4AG2xxTGUk/KdsR00c2IkCpd830FU+jqYFhoNTTUKzpDbWn3hyG6ZUWYPr3h0tZqaKPLTLUbolus+R88pc8/0jz/bPH8M/5Wb9ZmoduDgqB48sx75M+fvHoaeW9aK+A1vgoY9rbGVQwb4SoGJDdOIT5kiHIlysuefDVRz+bhh2GILiutgG2ka0ZkEbrZ8AAY2nZmTJSCZWqqq4DCl5QegYBr2iFFmNAcgamW3Sek40yFplVhYWANYXX2OdJx2gTpHncFgGyc2HDHRbnF/QHMVNPBxlQIE7ZTlk1P7qll3wrXAb9otBXMHY4xIz0FgrjBeMpFjHcc/aTZohvWbOYHsKo9ZfAI7Vz/A5hGNQ0HIlgqvtU7rh8O47rFgeXjt4I43yzxrT79CSzCB5Mb7sQIF5+uAHtuPxLG8rf3gxKs1jTm918t4WyTIT00ewWAiXDvnBktMcWcbZ/x+Vlh/Ba6t286G264/lp4GoAoAHwlljBKsui6IzesKE++/1F89J0kSikW7eE7JOMXoRzjomX5mqPEy+zkt/eRSFBfzgeYrV3pxNPv+qB8aZJZthSsmvKOorz6gQnpWtnk268M4CR2pL1DfDm/HFwst4qNmm9PPjj440ku4zi0LUdUOJat4ljm07F/+mvBXFVxtdzJCKciQFJE7BAlbm0mJ2XeoU3LeLHazfO8KIo8n+9Wi9noR/eWMoCb4xHc4+V8hI7lRwy/il9uhNn+x6c8ttzxgxLfP2vAU34Ds5B9vVuePudYAH+uGD8ZRaTajc8Gxos9lMoXtjt12mGifM6zAFcYAdLodw8F7kb5zL/5OauvaRb93l3lVrTHpAgwtc83DzmzrPnr9kqzpOqvtq/vlsXO3yzUCo8iwO6vlQtH8d3iYt+r42uLNVd/nXBQaBoQQJD9vTfKhR27+SoJfO9HNzPPD5JVbsUXYv/11jjHsSwF2/zqGinnprQVy9ar132aJkmSpvvX1S5jypbm1QqL2zmGnVIYsZuHMA4ZjFUhHcf5+KnMcm6+zzb7z+FgLO5fAuaf3P0G6fR9Zh+2hcbLQBcUraLfBxU89lAroTqKos8HFfzrg4wWRbvoL4OD0a51wUrxpbcowrJJo5b7FXtbKYbFv/YjeFD818++N8xkg040Dxkabh/7wuBnGq/F3lCUfYw28KLt6vYdiuq9c0NIN535VWy6PrtfHQ7qLoRVidL5MaK1xjPPdym63XZXglTvHaB7UF1uTgG0nY6ew6XosOSHiYbzaw8rdrjLr+0g6YN015gHph0k3Odw1VUQYWz1EkKDuR1Vw7DseKb4hNvrTgzBa3zCsi5m2El6WrsBa3O66T2kucXHY3Ryih8WvQykR3gXZxf9rL8QGkYHV74gsbTe2X4QZrde7cOy+5z7FNX2hAHw52ZYJ7Tf3RSSuqdjdSlGLRf70PS2QWND1e7iKQRFX/nMF0WrUyKknVe+v+FWq48pTHpKuk8M7Va7nvjvVs+ChiHnLbZb6DUn/US0WepDorcJTS1Ym5fbYNr719Bot4UUzHsfSqtlxaw1QwCusfdFbUOHtZa4ge/2Pt+XmHZrcz4knexq3yRubaiBfdy33IH27g/BFEcM2/vPaHovLI5wu7XyAnb952wV1ntbgn6ms9lVfWTW0nIU+DmC6bBayWirRCzLX4dhwOEt5d6w5aJvuQOiLcORN8ZCaxeGAQttCRIEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQWDnP/OgeA2PqqweAAAAAElFTkSuQmCC"
            }
            alt={`${user.username}'s profile image`}
            className="rounded-full w-24 h-24 object-cover"
          />
          <div className="ml-6">
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-2xl mr-10">{user.username}</h1>
              <button
                onClick={logoutUser}
                className="bg-secondary text-white hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <BiLogOut size={28} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
            <div className="flex mt-2">
              <div className="mr-6">
                {/* <p className="font-bold">{items.length}</p>
                <p className="text-sm text-gray-500">Posts</p> */}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <>
        {items.map((item) => (
          <div style={{ padding: "10px" }}>
            {isLoading ? <>Loading...</> : <PostCard {...item} />}
          </div>
        ))}
      </>
    </VirtualScroll>
  );
};

export default Profile;
