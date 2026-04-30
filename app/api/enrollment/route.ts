import BoxSDK from 'box-node-sdk'
import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs'
import PDFDocument from 'pdfkit'

/**
 * Box.com API Integration for Health Insurance Enrollment
 *
 * This endpoint handles health insurance enrollment submissions and uploads them to Box.com
 * as PDFs that can be accessed in the admin/office portal.
 */

interface EnrollmentData {
  firstName: FormDataEntryValue | null
  lastName: FormDataEntryValue | null
  email: FormDataEntryValue | null
  phone: FormDataEntryValue | null
  dateOfBirth: FormDataEntryValue | null
  ssn: FormDataEntryValue | null
  address: FormDataEntryValue | null
  city: FormDataEntryValue | null
  state: FormDataEntryValue | null
  zipCode: FormDataEntryValue | null
  planType: FormDataEntryValue | null
  coverageStartDate: FormDataEntryValue | null
  dependents: FormDataEntryValue | null
  healthConditions: FormDataEntryValue | null
  medications: FormDataEntryValue | null
  signature: FormDataEntryValue | null
  submittedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const enrollmentData: EnrollmentData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      dateOfBirth: formData.get('dateOfBirth'),
      ssn: formData.get('ssn'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode'),
      planType: formData.get('planType'),
      coverageStartDate: formData.get('coverageStartDate'),
      dependents: formData.get('dependents'),
      healthConditions: formData.get('healthConditions'),
      medications: formData.get('medications'),
      signature: formData.get('signature'),
      submittedAt: new Date().toISOString(),
    }

    const idDocument = formData.get('idDocument') as File | null
    const incomeDocument = formData.get('incomeDocument') as File | null
    const additionalDocuments = formData.get('additionalDocuments') as File | null

    const boxClientId = process.env.BOX_CLIENT_ID
    const boxClientSecret = process.env.BOX_CLIENT_SECRET
    const boxPrivateKeyPath = process.env.BOX_PRIVATE_KEY_PATH || './box-private-key.pem'
    const boxPublicKeyId = process.env.BOX_PUBLIC_KEY_ID
    const boxEnterpriseId = process.env.BOX_ENTERPRISE_ID
    const boxEnrollmentFolderId =
      process.env.BOX_ENROLLMENT_FOLDER_ID || process.env.BOX_APPLICATIONS_FOLDER_ID

    if (
      !boxClientId ||
      !boxClientSecret ||
      !boxPublicKeyId ||
      !boxEnterpriseId ||
      !boxEnrollmentFolderId
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

    const pdfBuffer = await generateEnrollmentPDF(
      enrollmentData,
      idDocument,
      incomeDocument,
      additionalDocuments
    )

    const fileName = `Enrollment_${enrollmentData.firstName}_${enrollmentData.lastName}_${Date.now()}.pdf`

    const uploadResponse = await client.files.uploadFile(
      boxEnrollmentFolderId,
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
      message: 'Enrollment submitted successfully',
      fileId: uploadResponse.entries[0].id,
      fileName: fileName,
      sharedLink: sharedLink.shared_link.url,
      boxUrl: `https://app.box.com/file/${uploadResponse.entries[0].id}`,
    })
  } catch (error: any) {
    console.error('Error submitting enrollment to Box:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to submit enrollment',
      },
      { status: 500 }
    )
  }
}

/**
 * Generate PDF from enrollment data
 */
async function generateEnrollmentPDF(
  enrollmentData: EnrollmentData,
  idDocument: File | null,
  incomeDocument: File | null,
  additionalDocuments: File | null
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    doc.on('error', reject)

    doc.fontSize(20).text('Health Insurance Enrollment Application', { align: 'center' })
    doc.moveDown()
    doc
      .fontSize(12)
      .text(`Submitted: ${new Date(enrollmentData.submittedAt).toLocaleString()}`, {
        align: 'center',
      })
    doc.moveDown(2)

    doc.fontSize(16).text('Personal Information', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Name: ${enrollmentData.firstName} ${enrollmentData.lastName}`)
    doc.text(`Email: ${enrollmentData.email}`)
    doc.text(`Phone: ${enrollmentData.phone}`)
    doc.text(`Date of Birth: ${enrollmentData.dateOfBirth}`)
    doc.text(`SSN: ${enrollmentData.ssn}`)
    doc.moveDown()
    doc.text('Address:')
    doc.text(`${enrollmentData.address}`, { indent: 20 })
    doc.text(
      `${enrollmentData.city}, ${enrollmentData.state} ${enrollmentData.zipCode}`,
      { indent: 20 }
    )
    doc.moveDown()

    doc.fontSize(16).text('Coverage Information', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    doc.text(`Plan Type: ${enrollmentData.planType}`)
    doc.text(`Coverage Start Date: ${enrollmentData.coverageStartDate}`)
    if (enrollmentData.dependents) {
      doc.moveDown()
      doc.text('Dependents:')
      doc.text(String(enrollmentData.dependents), { indent: 20 })
    }
    doc.moveDown()

    if (enrollmentData.healthConditions || enrollmentData.medications) {
      doc.fontSize(16).text('Health Information', { underline: true })
      doc.moveDown(0.5)
      doc.fontSize(12)
      if (enrollmentData.healthConditions) {
        doc.text('Health Conditions:')
        doc.text(String(enrollmentData.healthConditions), { indent: 20 })
        doc.moveDown()
      }
      if (enrollmentData.medications) {
        doc.text('Current Medications:')
        doc.text(String(enrollmentData.medications), { indent: 20 })
        doc.moveDown()
      }
    }

    doc.fontSize(16).text('Documents Submitted', { underline: true })
    doc.moveDown(0.5)
    doc.fontSize(12)
    if (idDocument) {
      doc.text(`✓ Government-Issued ID: ${idDocument.name || 'Uploaded'}`)
    }
    if (incomeDocument) {
      doc.text(`✓ Proof of Income: ${incomeDocument.name || 'Uploaded'}`)
    }
    if (additionalDocuments) {
      doc.text(`✓ Additional Documents: ${additionalDocuments.name || 'Uploaded'}`)
    }
    doc.moveDown()

    if (enrollmentData.signature) {
      doc.fontSize(16).text('Digital Signature', { underline: true })
      doc.moveDown(0.5)
      try {
        const sig = String(enrollmentData.signature)
        const signatureBuffer = Buffer.from(sig.split(',')[1] || sig, 'base64')
        doc.image(signatureBuffer, {
          fit: [200, 100],
        } as any)
        doc.moveDown()
        doc
          .fontSize(10)
          .text(
            `Signed by: ${enrollmentData.firstName} ${enrollmentData.lastName}`,
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
