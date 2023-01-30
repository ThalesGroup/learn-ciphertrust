import { FaGithub, FaTwitter } from "react-icons/fa"

export default function FooterComponent() {
    return (
        <footer className="flex flex-col h-24 w-full items-center justify-center border-t">
            <div>
                <a
                    className="items-center justify-center gap-2"
                    href="https://snpranav.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Built by <span className="text-blue-500 hover:text-blue-700 cursor-pointer">Pranav Shikarpur</span>
                </a>
                <a href='https://github.com/snpranav' className='ml-2 hover:text-blue-700 cursor-pointer' target={'_blank'}><FaGithub className='inline' /></a>
                <a href='https://twitter.com/snpranav' className='ml-2 hover:text-blue-700 cursor-pointer' target={'_blank'}><FaTwitter className='inline' /></a>
            </div>
            <div>
                <p>Tech used: <a href="https://cpl.thalesgroup.com/encryption/ciphertrust-manager?ref=https://github.com/snpranav/field-data-encryption-demo" className='text-blue-500 hover:text-blue-700' target={'_blank'}>CipherTrust Manager</a>, <a href="https://cpl.thalesgroup.com/encryption/ciphertrust-data-protection-gateway?ref=https://github.com/snpranav/field-data-encryption-demo" className='text-blue-500 hover:text-blue-700' target={'_blank'}>Data Protection Gateway</a>, Dynamo DB, Postgres, MongoDB, <a href="https://nextjs.org/?ref=https://github.com/snpranav/field-data-encryption-demo" className='text-blue-500 hover:text-blue-700'>NextJS</a></p>
            </div>
        </footer>
    )
}