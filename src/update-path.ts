import * as core from '@actions/core'
import * as path from 'path'
import {OSType, getOs} from './platform'
import {SemVer} from 'semver'

export async function updatePath(version: SemVer): Promise<string> {
  let rocmPath: string
  switch (await getOs()) {
    case OSType.linux:
      rocmPath = `/usr/local/cuda-${version.major}.${version.minor}`
      break
    case OSType.windows:
      rocmPath = `C:\\Program Files\\AMD\\ROCm\\${version.major}.${version.minor}`
  }
  core.debug(`Rocm path: ${rocmPath}`)
  // Export $CUDA_PATH
  core.exportVariable('ROCM_PATH', rocmPath)
  core.debug(`Cuda path vx_y: ${rocmPath}`)
  // // Export $CUDA_PATH_VX_Y
  // core.exportVariable(`CUDA_PATH_V${version.major}_${version.minor}`, rocmPath)
  // core.exportVariable(
  //   'CUDA_PATH_VX_Y',
  //   `CUDA_PATH_V${version.major}_${version.minor}`
  // )
  // Add $CUDA_PATH/bin to $PATH
  const binPath = path.join(rocmPath, 'bin')
  core.debug(`Adding to PATH: ${binPath}`)
  core.addPath(binPath)

  // Update LD_LIBRARY_PATH on linux, see: https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#environment-setup
  // if ((await getOs()) === OSType.linux) {
  //   // Get LD_LIBRARY_PATH
  //   const libPath = process.env.LD_LIBRARY_PATH
  //     ? process.env.LD_LIBRARY_PATH
  //     : ''
  //   // Get CUDA lib path
  //   const cudaLibPath = path.join(rocmPath, 'lib64')
  //   // Check if CUDA lib path is already in LD_LIBRARY_PATH
  //   if (!libPath.split(':').includes(cudaLibPath)) {
  //     // CUDA lib is not in LD_LIBRARY_PATH, so add it
  //     core.debug(`Adding to LD_LIBRARY_PATH: ${cudaLibPath}`)
  //     core.exportVariable(
  //       'LD_LIBRARY_PATH',
  //       cudaLibPath + path.delimiter + libPath
  //     )
  //   }
  // }
  // Return cuda path
  return rocmPath
}
