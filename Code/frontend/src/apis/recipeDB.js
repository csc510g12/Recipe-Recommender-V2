// Copyright (C) 2025 SE Recipe Recommender - All Rights Reserved
// You may use, distribute and modify this code under the terms of the MIT license.
// You should have received a copy of the MIT license with
// this file. If not, please write to: secheaper@gmail.com

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3003/api/v1",
});
