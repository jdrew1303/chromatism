function adapt( _dep, colourRef, illuminantDRef, illuminantSRef ) {
	var colour = _dep.operations.convert( _dep, "XYZ", colourRef );
	var illuminantD = _dep.operations.convert( _dep, "LMS", illuminantDRef );
  if (illuminantSRef) {
	  var illuminantS = _dep.operations.convert( _dep, "LMS", illuminantDRef );
  } else {
    var illuminantS = _dep.operations.convert( _dep, "LMS", _dep.helpers.getIlluminant("D65") );
  }

  // Bradford Transformation
  let Mb = [
    [ 0.8951000, 0.2664000, -0.1614000 ],
    [ -0.7502000, 1.7135000, 0.0367000 ],
    [ 0.0389000, -0.0685000, 1.0296000 ]
  ]

  // Inverse Bradford Transformation
  let Mbi = [
    [ 0.9869929, -0.1470543, 0.1599627 ],
    [ 0.4323053, 0.5183603, 0.0492912 ],
    [ -0.0085287, 0.0400428, 0.9684867 ]
  ]

  // Illuminant Ratio Matrix
  let Mir = [
    [ illuminantD.rho / illuminantS.rho, 0, 0 ],
    [ 0, illuminantD.gamma / illuminantS.gamma, 0 ],
    [ 0, 0, illuminantD.beta / illuminantS.beta ]
  ]

  // Illuminant ratio matrix, pre-inversion
  let MbiMir = _dep.helpers.matrixMultiply(Mbi, Mir)

  // Illuminant ratio matrix
  let M = _dep.helpers.matrixMultiply(MbiMir, Mb)

  console.log(M)
  console.log()

  let valueArray = [ colour.X, colour.Y, colour.Z ]

  let resultArray = M.map((m) => {
    return valueArray.reduce((acc, v, key) => {
      return (m[key] * v) + acc
    }, 0)
  })

  let result = {
    X: resultArray[0],
    Y: resultArray[1],
    Z: resultArray[2]
  }

	return _dep.helpers.ready( _dep, result );
}

module.exports = adapt;