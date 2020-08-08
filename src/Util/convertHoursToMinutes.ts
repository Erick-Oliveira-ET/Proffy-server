export default function convertHoursToMinutes(time: string){
    //8:00
    //Split the 8 and 00 and map it converting to numbers and associate to the 
    //variables on the array
    const [hour, minutes] = time.split(":").map(Number);
    return ((hour * 60) + minutes);

}