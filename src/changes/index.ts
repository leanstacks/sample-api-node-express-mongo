import Evolution from './evolution';
import v1 from './v1';

// create an Evolution instance
const evolution = new Evolution();

// add changes. changes are processed in the order added.
// version 1 changes
evolution.add(v1);

export default evolution;
