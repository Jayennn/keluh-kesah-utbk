import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import moment from "moment";
import {Timestamp} from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(time: Timestamp) {
  const duration = moment(time?.toDate()).startOf('seconds').fromNow();
  const [num, format] = duration.split(" ");
  return `${num} ${format}`
  // const days = Math.floor(duration.asDays());
  // const hours = duration.hours();
  // const minutes = duration.minutes();
  // const secs = duration.seconds();
  //
  // if (days > 0) {
  //   return `${days}d`;
  // } else if (hours > 0) {
  //   return `${hours}h`;
  // } else if (minutes > 0) {
  //   return `${minutes}m`;
  // } else {
  //   return `${secs}s`;
  // }
}


export function randomName() {
  const indonesianNames = [
    "Budi", "Siti", "Ayu", "Indra", "Teguh", "Dewi", "Agus", "Rina", "Wahyudi", "Nia",
    "Rizki", "Putri", "Yudha", "Lestari", "Sigit", "Yuni", "Bayu", "Wulan", "Adi", "Ratna"
  ];

  const randomIndex = Math.floor(Math.random() * indonesianNames.length);
  const randomName = indonesianNames[randomIndex];
  const randomNumber = Math.floor(100 + Math.random() * 900); // Generates a number between 100 and 999

  return `${randomName}#${randomNumber}`;
}
