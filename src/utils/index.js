import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import uuid from "uuid/v4";

export const getOrDefault = (object, path, fallback = "") => defaultTo(get(object, path), fallback);

export const formatRequestObject = ({ request, response, time }, content) => ({
  id: uuid(),
  request: request,
  response: response,
  time: Math.round(time),
  query: request.postData && request.postData.text && JSON.parse(request.postData.text),
  // TODO: improve checking that `content` is a JSON string
  content: typeof content === "string" && content[0] === "{" ? JSON.parse(content) : ""
});

export const findById = (collection, id) => collection.find(element => element.id === id);
