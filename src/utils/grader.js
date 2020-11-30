export const grader = grade => {
  if(grade <= 20) { 
    return 'F'
  } else if(grade <= 30) {
    return 'D'
  } else if(grade <= 40) {
    return 'C'
  } else if (grade <= 50) {
    return 'B'
  } else if (grade > 60) {
    return 'A'
  }
};