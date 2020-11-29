export const gradeColorizer = grade => {
  switch(grade) {
    case 'A': return 'text-green-500 text-6xl';
    case 'B': return 'text-blue-500 text-6xl';
    case 'C': return 'text-yellow-500 text-6xl';
    case 'D': return 'text-pink-500 text-6xl';
    case 'F': return 'text-red-500 text-6xl';
    default: return null;
  }
};
