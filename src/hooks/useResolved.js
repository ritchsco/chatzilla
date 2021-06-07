import { useEffect, useState } from 'react';


// return value is init as false
// go through the values to determine if they have resolved
// if val unresolved = false, else true
export const useResolved = (
    ...vals
) => {
    const [resolved, setResolved] = useState(false);

    useEffect(() => {
        setResolved(vals.every(v => v !== undefined));
    }, [vals]);

    // True if resolved other wise false
    return resolved;
};