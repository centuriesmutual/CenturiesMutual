import BoxSDK from 'box-node-sdk'
import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs'
import PDFDocument from 'pdfkit'

/**
 * Box.com API Integration for Job Applications
 *
 * This endpoint handles job application submissions and uploads them to Box.com
 * as PDFs that can be accessed in the admin/office portal.
 */

interface ApplicationData {
  firstName: FormDataEntryValue | null
  lastName: FormDataEntryValue | null
  email: FormDataEntryValue | null
  phone: FormDataEntryValue | null
  position: FormDataEntryValue | null
  experience: FormDataEntryValue | null
  education: FormDataEntryValue | null
  coverLetter: FormDataEntryValue | null
  portfolio: FormDataEntryValue | null
  availability: FormDataEntryValue | null
  salary: FormDataEntryValue | null
  references: FormDataEntryValue | null
  signature: FormDataEntryValue | null
  submittedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const applicationData: ApplicationData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      position: formData.get('position'),
      experience: formData.get('experience'),
      education: formData.get('education'),
      coverLetter: formData.get('coverLetter'),
      portfolio: formData.get('portfolio'),
      availability: formData.get('availability'),
      salary: formData.get('salary'),
      references: formData.get('references'),
      signature: formData.get('signature'),
      submittedAt: new Date().toISOString(),
    }

    const resumeFile = formData.get('resume') as File | null

    const boxClientId = process.env.BOX_CLIENT_ID
    const boxClientSecret = process.env.BOX_CLIENT_SECRET
    const boxPrivateKeyPath = process.env.BOX_PRIVATE_KEY_PATH || './box-private-key.pem'
    const boxPublicKeyId = process.env.BOX_PUBLIC_KEY_ID
    const boxEnterpriseId = process.env.BOX_ENTERPRISE_ID
    const boxApplicationsFolderId = process.env.BOX_APPLICATIONS_FOLDER_ID

    if (
      !boxClientId ||
      !boxClientSecret ||
      !boxPublicKeyId ||
      !boxEnterpriseId ||
      !boxApplicationsFolderId
    ) {
      console.error('Box.com credentials not configured')
      return NextResponse.json(
        {
          success: false,
          error: 'Box.com integration not configured. Please set up environment variables.',
        },
        { status: 500 }
      )
    }

    const sdk = new BoxSDK({
      clientID: boxClientId,
      clientSecret: boxClientSecret,
      appAuth: {
        keyID: boxPublicKeyId,
        privateKey: ((): string => {
          try {
            if (fs.existsSync(boxPrivateKeyPath)) {
              return fs.readFileSync(boxPrivateKeyPath, 'utf8')
            }
            if (process.env.BOX_PRIVATE_KEY) {
              return process.env.BOX_PRIVATE_KEY
            }
            throw new Error('Private key not found')
          } catch (error) {
            console.error('Error reading Box private key:', error)
            throw error
          }
        })(),
        passphrase: process.env.BOX_PASSPHRASE || '',
      },
    })

    const client = sdk.getAppAuthClient('enterprise', boxEnterpriseId)

    const pdfBuffer = await generateApplicationPDF(applicationData, resumeFile)

    const fileName = `Application_${applicationData.firstName}_${applicationData.lastName}_${Date.now()}.pdf`

    const uploadResponse = await client.files.uploadFile(
      boxApplicationsFolderId,
      fileName,
      Buffer.from(pdfBuffer)
    )

    const sharedLink = await (client.files as any).createSharedLink(
      uploadResponse.entries[0].id,
      {
        access: 'open',
        permissions: {
          can_download: true,
          can_preview: true,
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      fileId: uploadResponse.entries[0].id,
      fileName: fileName,
      sharedLink: sharedLink.shared_link.url,
      boxUrl: `https://app.box.com/file/${uploadResponse.entries[0].id}`,
    })
  } catch (error: any) {
    console.error('Error submitting application to Box:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to submit application',
      },
      { status: 500 }
    )
  }
}

/**
 * Generate PDF from application data
 */
async function generateApplicationPDF(
  applicationData: ApplicationData,
  resumeFile: File | null
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    doc.on('error', reject)

    doc.fontSize(20).text('Job Application', { align: 'center' })
    doc.moveDown()
    doc
      .fontSize(12)
      .text(`Submitted: ${new Date(applicationData.submittedAt).toLocaleString()}`, {
        align: 'center',
      })
    doc.moveDown(2)

    doc.fontSize(16).text('Personal Information', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Name: ${applicationData.firstName} ${applicationData.lastName}`)
    doc.text(`Email: ${applicationData.email}`)
    doc.text(`Phone: ${applicationData.phone}`)
    doc.moveDown()

    doc.fontSize(16).text('Position Information', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Position Applied For: ${applicationData.position}`)
    doc.text(`Years of Experience: ${applicationData.experience}`)
    doc.moveDown()
    doc.text('Education Background:')
    doc.text(String(applicationData.education ?? ''), { indent: 20 })
    doc.moveDown()

    doc.fontSize(16).text('Cover Letter', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(String(applicationData.coverLetter ?? ''), { indent: 20 })
    doc.moveDown()

    doc.fontSize(16).text('Additional Information', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Availability: ${applicationData.availability}`)
    if (applicationData.salary) {
      doc.text(`Salary Expectations: ${applicationData.salary}`)
    }
    if (applicationData.portfolio) {
      doc.text(`Portfolio: ${applicationData.portfolio}`)
    }
    if (applicationData.references) {
      doc.moveDown()
      doc.text('Professional References:')
      doc.text(String(applicationData.references), { indent: 20 })
    }
    doc.moveDown()

    if (applicationData.signature) {
      doc.fontSize(16).text('Digital Signature', { underline: true })
      doc.moveDown(0.5)
      try {
        const sig = String(applicationData.signature)
        const signatureBuffer = Buffer.from(sig.split(',')[1] || sig, 'base64')
        doc.image(signatureBuffer, {
          fit: [200, 100],
        } as any)
        doc.moveDown()
        doc
          .fontSize(10)
          .text(
            `Signed by: ${applicationData.firstName} ${applicationData.lastName}`,
            { align: 'left' }
          )
        doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' })
      } catch (error) {
        doc.text('Signature included (image processing error)', { indent: 20 })
      }
    }

    doc.end()
  })
}
