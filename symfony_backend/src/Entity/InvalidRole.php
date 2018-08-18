<?php
namespace App\Exception;

 
use Doctrine\ORM\Mapping as ORM;

/**
 * User
 *
 * @ORM\Table(name="user", indexes={@ORM\Index(name="name", columns={"name"}), @ORM\Index(name="email", columns={"email"})})
 * @ORM\Entity
 */
final class InvalidRole extends \Exception {}
{
   
	echo "That role cannot be used!";

}
