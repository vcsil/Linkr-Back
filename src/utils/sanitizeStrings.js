// eslint-disable-next-line import/no-unresolved
import { stripHtml } from "string-strip-html";

const sanitizeString = string => stripHtml(string.toString()).result.trim();

export default sanitizeString;