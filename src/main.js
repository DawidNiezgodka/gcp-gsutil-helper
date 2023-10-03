const core = require('@actions/core')
const { Storage } = require('@google-cloud/storage')

async function run() {
  try {
    // Initialize Google Cloud Storage
    const storage = new Storage()

    // Get inputs from action
    const bucketName = core.getInput('bucket_name')
    const filePath = core.getInput('local_file_path')
    const destinationName = core.getInput('destination_path')

    const bucket = storage.bucket(bucketName)

    // Check if file already exists in the bucket
    const [exists] = await bucket.file(destinationName).exists()
    core.debug(`File existence check completed. Exists: ${exists}`)

    if (exists) {
      // Delete the existing file
      await bucket.file(destinationName).delete()
      core.debug(`Deleted existing file: ${destinationName}`)
    }

    // Upload the new file
    await bucket.upload(filePath, {
      destination: destinationName
    })
    core.debug(`Uploaded file: ${filePath} as ${destinationName}`)
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`)
  }
}

run()
