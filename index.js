const cssParser = require( "css" );

// const toArray = parsedCss => {
//     return Object.keys( parsedCss ).reduce( ( result, selector ) => {
//         console.log( selector[ 0 ] );
//         return selector[ 0 ] === "@" ? result : [ ...result, [ selector, `${ selector } {
//             ${ parsedCss[ selector ] }
//         }` ] ];
//     }, [] );
// };

const joinRules = ( rule, completeStyle, selector ) => completeStyle[ selector ] = ( completeStyle[ selector ] || "" ) + rule.declarations.reduce( ( completeRule, { property, value } ) => property && value ? [ ...completeRule, `${ property }: ${ value };` ] : completeRule, [] ).join( " " );

// exports.parse = css => {
//     const parsedCss = cssParser.parse( css );
//     const stylesObject = parsedCss.stylesheet.rules.reduce( ( completeStyle, rule ) => {
//         rule.selectors?.forEach( selector => joinRules( rule, completeStyle, selector ) );
//         return completeStyle;
//     }, {} );
//     parsedCss.stylesheet.rules.filter( rule => rule.media ).forEach( rule => {
//         const mediaObject = rule.rules.reduce( ( completeMediaRule, mediaRule ) => {
//             mediaRule.selectors?.forEach( selector => joinRules( mediaRule, completeMediaRule, selector ) );
//             return completeMediaRule;
//         }, {} );
//         Object.keys( mediaObject ).forEach( mediaSelector => {
//             stylesObject[ mediaSelector ] = ( stylesObject[ mediaSelector ] || "" ) + ` @media ${ rule.media } { ${ mediaObject[ mediaSelector ] } }`;
//         } );
//     } );
//     return stylesObject;
// };

exports.parse = css => {
    const parsedCss = require( "css" ).parse( css );
    const stylesObject = parsedCss.stylesheet.rules.reduce( ( completeStyle, rule ) => {
        rule.selectors?.forEach( selector => joinRules( rule, completeStyle, selector ) );
        return completeStyle;
    }, {} );
    Object.keys( stylesObject ).forEach( selector => {
        for ( let otherSelector of Object.keys( stylesObject ).filter( otherSelector => otherSelector !== selector ) ) {
            if ( otherSelector.match( `${ selector }\\s+` ) ) {
                stylesObject[ selector ] = ( stylesObject[ selector ] || "" ) + ` ${ otherSelector.replace( selector, "&" ) } { ${ stylesObject[ otherSelector ]} }`;
                delete stylesObject[ otherSelector ];
            }
        }
    } );
    return stylesObject;
};