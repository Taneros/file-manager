import path from 'path';

export const up = (homeDir) => {

        const oneStepBack = path.join( homeDir, '../' )

        console.log( '\nCurrent directory is ', oneStepBack, '\n' )

        return oneStepBack
}