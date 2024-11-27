// Copyright (C) 2024 SE Recipe Recommender - All Rights Reserved
// You may use, distribute and modify this code under the
// terms of the MIT license.
// You should have received a copy of the MIT license with
// this file. If not, please write to: secheaper@gmail.com

import axios from "axios";
const KEY = "AIzaSyDmc6eBCwM7l3_9NrQIfz7bjV6VdmVgzoI";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
  params: {
    part: "snippet",
    maxResults: 1,
    order: "viewCount",
    topicId: "/m/02wbm",
    type: "video",
    safeSearch: "strict",
    key: KEY,
  },
});
