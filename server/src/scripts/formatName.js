"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatName = void 0;
var formatName = function (name) {
  var nameParts = name.trim().split(/\s+/); // Split by any whitespace
  var firstName =
    nameParts[0][0].toUpperCase() + nameParts[0].slice(1).toLowerCase();
  var lastName = nameParts
    .slice(1)
    .map(function (part) {
      return part[0].toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
  return { firstName: firstName, lastName: lastName };
};
exports.formatName = formatName;
console.log((0, exports.formatName)("SHRESHTH MIDDLENAME PUROHIT"));
// Output: { firstName: 'Shreshth', lastName: 'Middlename P
